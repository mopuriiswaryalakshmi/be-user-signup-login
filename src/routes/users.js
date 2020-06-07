/*
 *  Import external packages here;
 */
const router = require("express").Router();

/*
 *  Import project packages here;
 */
const { getUser, updateUser } = require("../controllers/users");
const { userValidatorFor } = require("../validations/users");

router
  .get("/users", getUser)
  .put("/users", userValidatorFor(updateUser.name), updateUser);

module.exports = router;
