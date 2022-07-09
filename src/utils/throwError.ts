export default function throwError(message: string) {
  throw {
    type: 400,
    message
  }
}