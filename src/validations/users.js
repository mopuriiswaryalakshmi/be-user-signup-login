/*
 *  Import external packages here;
 */
const Joi = require("@hapi/joi");

/*
 *  Import project packages here;
 */
const { updateUser } = require("../controllers/users");

const updateUserValidator = (request, response, next) => {
  const updateUserSchema = Joi.object({
    name: Joi.string().max(20),
    address: Joi.string().max(10),
    profilePicture: Joi.string(),
    gender: Joi.string(),
    maritalStatus: Joi.string(),
    dateOfBirth: Joi.string()
  }).and("address", "profilePicture", "gender", "maritalStatus", "dateOfBirth");
  const { error } = updateUserSchema.validate(request.body, {
    abortEarly: false
  });
  if (error) {
    return response.status(400).json({
      status: false,
      error: {
        error: "BadRequestError",
        message: "Request doesn't contain all the required fields.",
        errors: error.details.map(detail => detail.message)
      }
    });
  }
  next();
};

const userValidatorFor = methodType => (request, response, next) => {
  switch (methodType) {
    case updateUser.name:
      updateUserValidator(request, response, next);
      break;
    default:
      throw new Error(`Unknown method type '${methodType}' used for validator`);
  }
};

module.exports = {
  userValidatorFor
};
