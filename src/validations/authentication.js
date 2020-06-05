/*
 *  Import external packages here;
 */
const Joi = require("joi");

/*
 *  Import project packages here;
 */
const { login, signUp } = require("../controllers/authentication");

//  eslint-disable-next-line consistent-return
const loginRequestValidator = (request, response, next) => {
  const loginSchema = Joi.object().keys({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().required()
  });
  const { error } = Joi.validate(request.body, loginSchema, {
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

//  eslint-disable-next-line consistent-return
const signUpRequestValidator = (request, response, next) => {
  const singUpSchema = Joi.object().keys({
    email: Joi.string()
      .email()
      .required(),
    name: Joi.string().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string()
      .required()
      .valid(Joi.ref("password"))
  });
  const { error } = Joi.validate(request.body, singUpSchema, {
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

const authenticationValidatorFor = methodType => (request, response, next) => {
  switch (methodType) {
    case login.name:
      //  do something here;
      loginRequestValidator(request, response, next);
      break;
    case signUp.name:
      signUpRequestValidator(request, response, next);
      break;
    default:
      throw new Error(
        `Unknown method type '${methodType}' used for validation.`
      );
  }
};

module.exports = {
  authenticationValidatorFor
};
