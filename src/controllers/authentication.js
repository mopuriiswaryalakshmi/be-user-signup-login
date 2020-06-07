/*
 *  Import external packages here;
 */
const jwt = require("jsonwebtoken");

/*
 *  Import project packages here;
 */
const User = require("../models/user");
const { generateHashAndSalt, isPasswordValid } = require("../utility/user");
const { secret } = require("../../config");

const signUp = (request, response) => {
  const childLogger = request.logger.child({
    controllerName: "createOrder"
    // traceId: uniqid()
  });
  childLogger.info({ req: request });
  const { email, password, name } = request.body;

  User.findOne({
    email
  })
    .then(result => {
      if (result) {
        return response.status(409).send({
          status: false,
          error: {
            name: "ConflictError",
            message: `A user with the email "${email}" has already signed up.`
          }
        });
      }
      const { hash, salt } = generateHashAndSalt(password);

      const user = new User({
        email,
        name,
        hash,
        salt
      });

      user
        .save()
        .then(savedUser => {
          const token = jwt.sign(
            {
              //  eslint-disable-next-line no-underscore-dangle
              id: savedUser._id,
              email: savedUser.email
            },
            secret
          );
          return response.status(201).json({
            status: true,
            data: {
              //  eslint-disable-next-line no-underscore-dangle
              id: savedUser._id,
              email: savedUser.email,
              token
            }
          });
        })
        .catch(error =>
          response.status(500).json({
            status: false,
            error: {
              name: error.name,
              message: error.message
            }
          })
        );
    })
    .catch(error =>
      response.status(500).json({
        status: false,
        error: {
          name: error.name,
          message: error.message
        }
      })
    );
};

const login = (request, response) => {
  const { email, password } = request.body;
  User.findOne({
    email
  })
    .then(user => {
      if (!user) {
        return response.status(404).send({
          status: false,
          error: {
            name: "NotFoundError",
            message: "User with the given email not found."
          }
        });
      }
      if (!isPasswordValid(user.salt, user.hash, password)) {
        return response.status(404).send({
          status: false,
          error: {
            name: "NotFoundError",
            message: "Please check your password."
          }
        });
      }
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email
        },
        secret
      );
      return response.send({
        status: true,
        data: {
          id: user._id,
          email: user.email,
          name: user.name,
          categorization: user.categorization,
          token
        }
      });
    })
    .catch(error => {
      return response.status(500).send({
        status: false,
        error: {
          name: error.name,
          message: error.message
        }
      });
    });
};

module.exports = {
  login,
  signUp
};
