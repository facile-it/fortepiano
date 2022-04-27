import { taskEither } from 'fp-ts'

export const tryCatch: typeof taskEither.tryCatch = (f, onRejected) =>
  taskEither.tryCatch(() => {
    try {
      return f()
    } catch (error) {
      return Promise.reject(error)
    }
  }, onRejected)
