/*
 *  Import project packages here;
 */
const User = require("../models/user");
const { ObjectId } = require("mongoose").Types;

const getUser = (request, response) => {
  User.find()
    .then(users => {
      // const userToSend = JSON.parse(JSON.stringify(users));
      // delete userToSend.hash;
      // delete userToSend.salt;
      return response.status(201).json({
        status: true,
        data: users
      });
    })
    .catch(creationError =>
      response.status(500).json({
        status: false,
        error: {
          error: creationError.name,
          message: creationError.message
        }
      })
    );
};

const updateUser = (request, response) => {
  const queryCriteria = {
    _id: ObjectId(request.params.id)
  };
  User.findOne(queryCriteria)
    .then(user => {
      if (!user) {
        return response.status(404).json({
          status: false,
          error: {
            error: "NotFoundError",
            message: `user with id ${request.params.id} not found.`
          }
        });
      }
      user.set(request.body);
      user
        .save()
        .then(saveuser => {
          const userToSend = JSON.parse(JSON.stringify(saveuser));
          delete userToSend.hash;
          delete userToSend.salt;
          return response.status(200).json({
            status: true,
            data: userToSend
          });
        })
        .catch(saveError => {
          return response.status(500).json({
            status: false,
            error: {
              error: saveError.name,
              message: saveError.message
            }
          });
        });
    })
    .catch(fetchError =>
      response.status(500).json({
        status: false,
        error: {
          error: fetchError.name,
          message: fetchError.message
        }
      })
    );
};

module.exports = {
  getUser,
  updateUser
};
