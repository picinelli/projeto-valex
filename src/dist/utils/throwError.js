export default function throwError(message) {
    throw {
        type: 400,
        message: message
    };
}
