export default function validateSchema(schema, body) {
    var _a = schema.validate(body), error = _a.error, value = _a.value;
    if (error) {
        throw {
            type: 400,
            message: error.details[0].message
        };
    }
}
