/*
 * Import external packages here
 */
const express = require("express");
require("dotenv-flow").config();
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const expressJWT = require("express-jwt");
const swaggerUi = require("swagger-ui-express");
// const passport = require("passport");

// const initializePassport = require("./passport.config");
// initializePassport(passport);
/*
 *  Import project packages here;
 */
// const swaggerDocument = require("./docs/api/openapi");

/*
 * Import database modules here;
 */
const makeDatabaseConnection = require("./src/connections/db-connections");

/*
 *  Import route modules here;
 */
const userRouter = require("./src/routes/users");
const authRouter = require("./src/routes/authentication");

/*
 * Import configuration here;
 */
const {
  apiPathDetails: { apiVersion, basePath }
} = require("./config");

/*
 * Import Logs here;
 */
const { getLogger } = require("./src/utility/logs");

process.on("exit", code => {
  // eslint-disable-next-line no-console
  console.log(`Exiting with code ${code}`);
  mongoose.disconnect();
});

// eslint-disable-next-line no-unused-vars
makeDatabaseConnection()
  // eslint-disable-next-line no-unused-vars
  .then(connection => {
    // eslint-disable-next-line no-console
    console.log("Connected to the database");

    const app = express();
    app.set("PORT", process.env.LOCALHOST_PORT);

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());

    app.use(express.static("public"));

    // app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.use((request, response, next) => {
      request.logger = getLogger();
      next();
    });

    // app.get("/", (req, res) => {
    //   res.render("index.ejs");
    // });

    // app.get("/login", (req, res) => {
    //   res.render("login.ejs");
    // });

    app.use(
      expressJWT({ secret: "secret" }).unless({
        path: [
          `${basePath}/${apiVersion}/signup`,
          `${basePath}/${apiVersion}/login`,
          `${basePath}/${apiVersion}/hello`
        ]
      })
    );

    app.use(`${basePath}/${apiVersion}`, userRouter);
    app.use(`${basePath}/${apiVersion}`, authRouter);

    app.get(`${basePath}/${apiVersion}/hello`, (request, response) => {
      response.send("hello");
    });

    // eslint-disable-next-line no-unused-vars
    app.use((error, request, response, next) => {
      if (typeof error === "string") {
        // custom application error
        return response.status(400).json({
          status: false,
          error: {
            error: "Generic Error",
            message: error
          }
        });
      }

      if (error.code == "permission denied") {
        return response.status(403).json({
          status: false,
          error: {
            error: "Forbidden Error",
            message: "You don't have enough permisssion to access the API."
          }
        });
      }

      if (error.name === "UnauthorizedError") {
        // jwt authentication error
        return response.status(401).json({
          status: false,
          error: {
            error: error.name,
            message: "Invalid Token."
          }
        });
      }

      // default to 500 server error
      return response.status(500).json({
        status: false,
        error: {
          error: error.name,
          message: error.message
        }
      });
    });

    http.createServer(app).listen(app.get("PORT"), err => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log(`Error while start up the server, ${err}`);
        process.exit(2);
      }
      // eslint-disable-next-line no-console
      console.log(`HTTP server running on ${app.get("PORT")}`);
    });
  })
  .catch(error => {
    // eslint-disable-next-line no-console
    console.log(error.message);
    process.exit(2);
  });
