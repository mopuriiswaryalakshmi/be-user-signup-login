/*
 *  Import external packages here;
 */
const router = require("express").Router();

/*
 *  Import project packages here;
 */
const { login, signUp } = require("../controllers/authentication");
const { authenticationValidatorFor } = require("../validations/authentication");

router.post("/login", authenticationValidatorFor(login.name), login);

router.post("/signup", authenticationValidatorFor(signUp.name), signUp);

module.exports = router;
