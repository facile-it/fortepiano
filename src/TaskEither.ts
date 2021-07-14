import * as TE from 'fp-ts/TaskEither'

export const tryCatch: typeof TE.tryCatch = (f, onRejected) =>
  TE.tryCatch(() => {
    try {
      return f()
    } catch (error) {
      return Promise.reject(error)
    }
  }, onRejected)
