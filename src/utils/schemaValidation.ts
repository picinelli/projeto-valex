export default function validateSchema(schema: any, body: any) {
  const { error, value } = schema.validate(body);
  if(error) {
    throw {
      type: 400,
      message: error.details[0].message,
    }
  }
}