import { number } from 'fp-ts'
import { pipe, tupled } from 'fp-ts/function'
import { curry } from './function'
import { Mock, mock } from './Mock'
import * as $RA from './ReadonlyArray'
import { readonlyRecord } from './ReadonlyRecord'

describe('Mock', () => {
  describe('undefined', () => {
    it('should return undefined', () => {
      expect(mock.undefined()()).toBeUndefined()
    })
  })

  describe('null', () => {
    it('should return null', () => {
      expect(mock.null()()).toBeNull()
    })
  })

  describe('boolean', () => {
    it('should return a random boolean', () => {
      expect(typeof mock.boolean()()).toBe('boolean')
    })
    it('should allow returning a custom boolean', () => {
      for (let i = 0; i < 10; i++) {
        expect(mock.boolean(true)()).toBe(true)
      }
    })
  })

  describe('float', () => {
    it('should return a random float', () => {
      const x = mock.float()()()

      expect(Math.floor(x)).not.toBe(x)
    })
    it("shouldn't allow returning an out-of-bounds custom float", () => {
      expect(mock.float(0, 1)(-42)()).toBeGreaterThanOrEqual(0)
      expect(mock.float(0, 1)(42)()).toBeLessThan(1)
    })
  })

  describe('integer', () => {
    it('should return a random integer', () => {
      const x = mock.integer()()()

      expect(Math.floor(x)).toBe(x)
    })
    it("shouldn't allow returning a custom float", () => {
      expect(mock.integer()(3.14)()).toBe(3)
    })
    it("shouldn't allow returning an out-of-bounds custom integer", () => {
      expect(mock.integer(0, 1)(-42)()).toBeGreaterThanOrEqual(0)
      expect(mock.integer(0, 1)(42)()).toBeLessThan(1)
    })
  })

  describe('number', () => {
    it('should return a random number', () => {
      expect(typeof mock.number()()()).toBe('number')
    })
    it('should allow setting bottom boundary', () => {
      for (let i = 0; i < 10; i++) {
        expect(
          mock.number(Math.pow(2, 16), -Infinity)()(),
        ).toBeGreaterThanOrEqual(Math.pow(2, 16))
      }
    })
    it('should allow setting top boundary', () => {
      for (let i = 0; i < 10; i++) {
        expect(mock.number(undefined, -Math.pow(2, 16))()()).toBeLessThan(
          -Math.pow(2, 16),
        )
      }
    })
    it('should allow setting bottom and top boundaries', () => {
      for (let i = 0; i < 10; i++) {
        const x = mock.number(-2, 2)()()

        expect(x).toBeGreaterThanOrEqual(-2)
        expect(x).toBeLessThan(2)
      }
    })
    it('should allow returning a custom number', () => {
      expect(mock.number()(1138)()).toBe(1138)
    })
    it('should allow returning one of many custom numbers', () => {
      for (let i = 0; i < 10; i++) {
        expect(
          [1138, 1337].indexOf(mock.number()(1138, 1337)()),
        ).toBeGreaterThanOrEqual(0)
      }
    })
    it("shouldn't allow returning an out-of-bounds custom number", () => {
      expect(mock.number(0, 1)(-42)()).toBeGreaterThanOrEqual(0)
      expect(mock.number(0, 1)(42)()).toBeLessThan(1)
    })
  })

  describe('string', () => {
    it('should return a random string', () => {
      expect(typeof mock.string()()).toBe('string')
    })
    it('should allow returning a custom string', () => {
      expect(mock.string('foo')()).toBe('foo')
    })
    it('should allow returning one of many custom strings', () => {
      for (let i = 0; i < 10; i++) {
        expect(
          ['foo', 'bar'].indexOf(mock.string('foo', 'bar')()),
        ).toBeGreaterThanOrEqual(0)
      }
    })
  })

  describe('unknown', () => {
    it('should return a random value of any type', () => {
      for (let i = 0; i < 10; i++) {
        const x = mock.unknown()()()

        expect(
          ['undefined', 'boolean', 'number', 'string', 'object'].indexOf(
            typeof x,
          ),
        ).toBeGreaterThanOrEqual(0)
      }
    })
    it('should allow returning a custom value', () => {
      const a = mock.unknown()(true)()
      const b = mock.unknown()(1138)()
      const c = mock.unknown()('foo')()
      const d = mock.unknown()([1138])()
      const e = mock.unknown()({ foo: 1138 })()

      expect(a).toBe(true)
      expect(b).toBe(1138)
      expect(c).toBe('foo')
      expect(d).toStrictEqual([1138])
      expect((e as any).foo).toBe(1138)
    })
  })

  describe('nullable', () => {
    it('should make a mock nullable', () => {
      const M = mock.nullable(mock.number())

      for (let i = 0; i < 10; i++) {
        expect(
          ['undefined', 'number'].indexOf(typeof M()()),
        ).toBeGreaterThanOrEqual(0)
      }
    })
    it('should allow returning undefined', () => {
      const M = mock.nullable(mock.number())

      expect(M(undefined)()).toBeUndefined()
    })
  })

  describe('literal', () => {
    it('should return the provided value', () => {
      expect(mock.literal(true)()()).toBe(true)
      expect(mock.literal(1138)()()).toBe(1138)
      expect(mock.literal('foo')()()).toBe('foo')
    })
    it('should allow returning a custom value', () => {
      expect(mock.literal<42 | 1138>(1138)(42)()).toBe(42)
      expect(mock.literal<'foo' | 'bar'>('foo')('bar')()).toBe('bar')
    })
  })

  describe('struct', () => {
    const M = mock.struct({
      a: mock.boolean,
      b: mock.number(),
      c: mock.string,
    })
    const deepM = mock.struct({
      a: mock.boolean,
      b: mock.struct({
        c: mock.number(),
        d: mock.struct({
          e: mock.string,
          f: mock.struct({
            g: mock.readonlyArray(mock.unknown()),
            h: mock.undefined,
          }),
        }),
      }),
    })

    it('should return a random struct with a defined shape', () => {
      const x = M()()

      expect(typeof x.a).toBe('boolean')
      expect(typeof x.b).toBe('number')
      expect(typeof x.c).toBe('string')
    })
    it('should allow overwriting part of the random struct', () => {
      const x = M({ b: 1138 })()

      expect(typeof x.a).toBe('boolean')
      expect(x.b).toBe(1138)
      expect(typeof x.c).toBe('string')
    })
    it('should allow overwriting deep parts of the random struct', () => {
      const x = deepM({ b: { c: 1138, d: { f: { g: [1138] } } } })()

      expect(typeof x.a).toBe('boolean')
      expect(x.b.c).toBe(1138)
      expect(typeof x.b.d.e).toBe('string')
      expect(x.b.d.f.g).toStrictEqual([1138])
      expect(x.b.d.f.h).toBeUndefined()
    })
    it('should ignore undefined values', () => {
      const x = M({ a: undefined, b: 1138 })()

      expect(typeof x.a).toBe('boolean')
      expect(x.b).toBe(1138)
      expect(typeof x.c).toBe('string')
    })
    it('should ignore deep undefined values', () => {
      const x = deepM({ b: { c: 1138, d: undefined } })()

      expect(typeof x.a).toBe('boolean')
      expect(x.b.c).toBe(1138)
      expect(typeof x.b.d.e).toBe('string')
      expect(x.b.d.f.g instanceof Array).toBe(true)
      expect(x.b.d.f.h).toBeUndefined()
    })
  })

  describe('tuple', () => {
    const M = mock.tuple(mock.boolean, mock.number(), mock.string)

    it('should return a random tuple with a defined shape', () => {
      const x = M()()

      expect(typeof x[0]).toBe('boolean')
      expect(typeof x[1]).toBe('number')
      expect(typeof x[2]).toBe('string')
    })
    it('should allow returning a custom tuple', () => {
      const x = M([true, 1138, 'foo'])()

      expect(x[0]).toBe(true)
      expect(x[1]).toBe(1138)
      expect(x[2]).toBe('foo')
    })
  })

  describe('partial', () => {
    it('should return a random partial struct with a defined shape', () => {
      const M = mock.partial({
        a: mock.boolean,
        b: mock.number(),
        c: mock.string,
      })

      for (let i = 0; i < 10; i++) {
        const x = M()()

        expect(
          ['undefined', 'boolean'].indexOf(typeof x.a),
        ).toBeGreaterThanOrEqual(0)
        expect(
          ['undefined', 'number'].indexOf(typeof x.b),
        ).toBeGreaterThanOrEqual(0)
        expect(
          ['undefined', 'string'].indexOf(typeof x.c),
        ).toBeGreaterThanOrEqual(0)
      }
    })
    it('should allow overwriting part of the random partial struct', () => {
      const M = mock.partial({
        a: mock.boolean,
        b: mock.number(),
        c: mock.string,
      })

      for (let i = 0; i < 10; i++) {
        const x = M({ b: 1138 })()

        expect(
          ['undefined', 'boolean'].indexOf(typeof x.a),
        ).toBeGreaterThanOrEqual(0)
        expect(x.b).toBe(1138)
        expect(
          ['undefined', 'string'].indexOf(typeof x.c),
        ).toBeGreaterThanOrEqual(0)
      }
    })
    it('should ignore undefined values', () => {
      const M = mock.partial({
        a: mock.boolean,
        b: mock.number(),
        c: mock.string,
      })

      for (let i = 0; i < 10; i++) {
        const x = M({ a: undefined, b: 1138 })()

        expect(
          ['undefined', 'boolean'].indexOf(typeof x.a),
        ).toBeGreaterThanOrEqual(0)
        expect(x.b).toBe(1138)
        expect(
          ['undefined', 'string'].indexOf(typeof x.c),
        ).toBeGreaterThanOrEqual(0)
      }
    })
  })

  describe('union', () => {
    const M = mock.union(mock.boolean, mock.number(), mock.string)

    it('should return a random value of one of the specified types', () => {
      for (let i = 0; i < 10; i++) {
        const x = M()()

        expect(
          ['boolean', 'number', 'string'].indexOf(typeof x),
        ).toBeGreaterThanOrEqual(0)
      }
    })
    it('should allow returning a custom value', () => {
      const a = M(true)()
      const b = M(1138)()
      const c = M('foo')()

      expect(a).toBe(true)
      expect(b).toBe(1138)
      expect(c).toBe('foo')
    })
    it('should allow overwriting part of a struct', () => {
      const x = mock.union(
        mock.struct({ a: mock.boolean, b: mock.number(), c: mock.string }),
        mock.struct({ a: mock.boolean, b: mock.number(), c: mock.string }),
      )({ b: 1138 })()

      expect(typeof x.a).toBe('boolean')
      expect(x.b).toBe(1138)
      expect(typeof x.c).toBe('string')
    })
  })

  describe('readonlyArray', () => {
    it('should return a random array', () => {
      const xs = mock.readonlyArray(mock.number())()()

      expect(xs.reduce((acc, x) => acc && 'number' === typeof x, true)).toBe(
        true,
      )
    })
    it('should return an array with random elements', () => {
      const xs = mock.readonlyArray(mock.number(), 2)()()

      expect($RA.same(number.Eq)(xs)).toBe(false)
    })
    it('should allow returning a custom array', () => {
      const xs = mock.readonlyArray(mock.number())([1138, 1337])()

      expect(xs).toStrictEqual([1138, 1337])
    })
    it('should allow returning one of many custom arrays', () => {
      for (let i = 0; i < 10; i++) {
        const xs = mock.readonlyArray(mock.number())([1138, 1337], [138, 337])()

        expect(
          ['1138,1337', '138,337'].indexOf(xs.join(',')),
        ).toBeGreaterThanOrEqual(0)
      }
    })
    it('should allow returning an empty array', () => {
      const xs = mock.readonlyArray(mock.number(), -Infinity, -Infinity)()()

      expect(xs).toHaveLength(0)
    })
    it('should allow boundaries on array size', () => {
      const xs = mock.readonlyArray(mock.number(), 3, 5)()()

      expect(xs.length).toBeGreaterThanOrEqual(3)
      expect(xs.length).toBeLessThanOrEqual(5)
    })
  })

  describe('readonlyNonEmptyArray', () => {
    it("shouldn't allow returning an empty array", () => {
      const xs = mock.readonlyNonEmptyArray(
        mock.number(),
        -Infinity,
        -Infinity,
      )()()

      expect(xs).toHaveLength(1)
    })
  })

  describe('readonlyRecord', () => {
    it('should return a random record', () => {
      const xs = mock.readonlyRecord(mock.string, mock.number())()()

      expect(
        Object.values(xs).reduce(
          (acc, x) => acc && 'number' === typeof x,
          true,
        ),
      ).toBe(true)
    })
    it('should return a record with random elements', () => {
      const xs = mock.readonlyRecord(mock.string, mock.number(), 2)()()

      expect(readonlyRecord.same(number.Eq)(xs)).toBe(false)
    })
    it('should allow returning a custom record', () => {
      const xs = mock.readonlyRecord(
        mock.string,
        mock.number(),
      )({ foo: 1138, bar: 1337 })()

      expect(xs.foo).toStrictEqual(1138)
      expect(xs.bar).toStrictEqual(1337)
    })
    it('should allow returning one of many custom records', () => {
      for (let i = 0; i < 10; i++) {
        const xs = mock.readonlyRecord(mock.string, mock.number())(
          { foo: 1138, bar: 1337 },
          { mad: 138, max: 337 },
        )()

        expect(
          (1138 === xs.foo && 1337 === xs.bar) ||
            (138 === xs.mad && 337 === xs.max),
        ).toBe(true)
      }
    })
    it('should ignore undefined values', () => {
      const xs = mock.readonlyRecord(
        mock.string,
        mock.number(),
      )({ foo: 1138, bar: undefined })()

      expect(xs.foo).toStrictEqual(1138)
      expect('bar' in xs).toBe(false)
    })
    it('should allow returning an empty record', () => {
      const xs = mock.readonlyRecord(
        mock.string,
        mock.number(),
        -Infinity,
        -Infinity,
      )()()

      expect(Object.values(xs)).toHaveLength(0)
    })
    it('should allow boundaries on record size', () => {
      const xs = mock.readonlyRecord(mock.string, mock.number(), 3, 5)()()

      expect(Object.values(xs).length).toBeGreaterThanOrEqual(3)
      expect(Object.values(xs).length).toBeLessThanOrEqual(5)
    })
  })

  describe('Functor', () => {
    const { map } = mock.Functor
    const fa = mock.of(42)
    const ab = (a: number) => a + 1
    const bc = (a: number) => a / 2

    it('identity', () => {
      expect(map(fa, (a) => a)()()).toBe(fa()())
    })
    it('composition', () => {
      expect(map(fa, (a) => bc(ab(a)))()()).toBe(map(map(fa, ab), bc)()())
    })

    describe('map', () => {
      const firstName = mock.union(mock.of('Mario'), mock.of('Luigi'))
      const lastName = mock.of('Mario')
      const fullName = <A extends string, B extends string>(
        _firstName: A,
        _lastName: B,
      ): `${A} ${B}` => `${_firstName} ${_lastName}` as `${A} ${B}`

      it('should transform Mock value using a given function', () => {
        expect(typeof map(mock.number(), (a) => a.toString())()()).toBe(
          'string',
        )
        expect(
          map(
            mock.readonlyNonEmptyArray(mock.unknown()),
            (as) => as.length,
          )()(),
        ).toBeGreaterThan(0)
        expect(
          ['Mario Mario', 'Luigi Mario'].indexOf(
            pipe(
              mock.tuple(firstName, lastName),
              mock.map(tupled(fullName)),
            )()(),
          ),
        ).toBeGreaterThanOrEqual(0)
      })
      it('should allow returning a custom value', () => {
        expect(
          map(
            mock.readonlyNonEmptyArray(mock.unknown()),
            (as) => as.length,
          )(1138)(),
        ).toBe(1138)
        expect(
          map(
            mock.readonlyNonEmptyArray(mock.unknown()),
            (as) => as.length,
          )()(),
        ).toBeGreaterThan(0)
        expect(
          pipe(
            mock.tuple(firstName, lastName),
            mock.map(tupled(fullName)),
          )('Franco Franchi')(),
        ).toBe('Franco Franchi')
      })
    })
  })

  describe('Pointed', () => {
    const { of } = mock.Pointed

    describe('of', () => {
      it('should return the provided value', () => {
        expect(of(true)()()).toBe(true)
        expect(of(1138)()()).toBe(1138)
        expect(of('foo')()()).toBe('foo')
      })
      it('should allow returning a custom value', () => {
        expect(of(true)(false)()).toBe(false)
        expect(of(1138)(42)()).toBe(42)
        expect(of('foo')('bar')()).toBe('bar')
      })
    })
  })

  describe('Apply', () => {
    const { map, ap } = mock.Apply
    const fa = mock.of(42)
    const ab = (a: number) => a + 1
    const bc = (a: number) => a / 2

    it('associative composition', () => {
      expect(
        ap(
          ap(
            map(
              mock.of(bc),
              (_bc) => (_ab: (a: number) => number) => (a) => _bc(_ab(a)),
            ),
            mock.of(ab),
          ),
          fa,
        )()(),
      ).toBe(ap(mock.of(bc), ap(mock.of(ab), fa))()())
    })

    describe('ap', () => {
      const M: Mock<(a: number) => string> = () => () => (a) => a.toString()
      const fullName = (firstName: string, lastName: string): string =>
        `${firstName} ${lastName}`

      it('should apply a mocked function to Mock value', () => {
        expect(typeof ap(M, mock.number())()()).toBe('string')
        expect(
          /^\w+ \w+$/.test(
            pipe(
              mock.string,
              mock.map(curry(fullName)),
              mock.ap(mock.string),
            )()(),
          ),
        ).toBe(true)
      })
      it('should allow returning a custom value', () => {
        expect(ap(M, mock.number())('foo')()).toBe('foo')
        expect(
          pipe(
            mock.string,
            mock.map(curry(fullName)),
            mock.ap(mock.string),
          )('Jonathan')(),
        ).toBe('Jonathan')
      })
    })
  })

  describe('Applicative', () => {
    const { of, ap } = mock.Applicative
    const a = 42
    const fa = of(a)
    const ab = (_a: number) => _a + 1

    it('identity', () => {
      expect(
        ap(
          of((_a) => _a),
          fa,
        )()(),
      ).toBe(fa()())
    })
    it('homomorphism', () => {
      expect(ap(of(ab), of(a))()()).toBe(of(ab(a))()())
    })
    it('interchange', () => {
      expect(ap(of(ab), of(a))()()).toBe(
        ap(
          of((_ab: (a: number) => number) => _ab(a)),
          of(ab),
        )()(),
      )
    })
  })

  describe('Chain', () => {
    const { chain } = mock.Chain
    const fa = mock.of(42)
    const afb = (a: number) => mock.of(a + 1)
    const bfc = (a: number) => mock.of(a / 2)

    it('associativity', () => {
      expect(chain(chain(fa, afb), bfc)()()).toBe(
        chain(fa, (a) => chain(afb(a), bfc))()(),
      )
    })

    describe('chain', () => {
      const M = pipe(
        mock.Do,
        mock.apS(
          'first',
          mock.union(
            mock.of('Vincent'),
            mock.of('Esmeralda'),
            mock.of('Marcellus'),
          ),
        ),
        mock.apS(
          'last',
          mock.union(
            mock.of('Vega'),
            mock.of('Villalobos'),
            mock.of('Wallace'),
          ),
        ),
        mock.chain(({ first, last }) =>
          mock.struct({
            id: mock.string,
            firstName: mock.of(first),
            lastName: mock.of(last),
            email: mock.of(`${first}.${last}@pulp.com`.toLowerCase()),
          }),
        ),
      )

      it('should transform Mock value and chain the result', () => {
        const x = M()()

        expect(x.email).toBe(
          `${x.firstName}.${x.lastName}@pulp.com`.toLowerCase(),
        )
      })
      it('should allow overwriting part of a struct', () => {
        const x = M({ lastName: 'Wolf' })()

        expect(x.lastName).toBe('Wolf')
        expect(x.email).toMatch(
          /(Vincent|Esmeralda|Marcellus)\.(Vega|Villalobos|Wallace)@pulp\.com/i,
        )
      })
    })
  })

  describe('Monad', () => {
    const { of, chain } = mock.Monad
    const a = 42
    const fa = of(a)
    const f = (_a: number) => of(_a + 1)

    it('left identity', () => {
      expect(chain(of(a), f)()()).toBe(f(a)()())
    })
    it('right identity', () => {
      expect(chain(fa, of)()()).toBe(fa()())
    })
  })

  describe('FromIO', () => {
    const { fromIO } = mock.FromIO

    describe('fromIO', () => {
      it('should wrap an IO into a Mock', () => {
        expect(typeof fromIO(() => Math.random())()()).toBe('number')
      })
      it('should allow returning a custom value', () => {
        expect(fromIO(() => Math.random())(1138)()).toBe(1138)
      })
    })
  })
})
