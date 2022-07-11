export default function errorHandler(error, req, res, next) {
    if (error.message) {
        return res.status(error.type).send(error.message);
    }
    console.log(error);
    return res.sendStatus(500);
}
