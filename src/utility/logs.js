/*
 *Import external packages here;
 */
const bunyan = require("bunyan");
const fs = require("fs");
// const uniqid = require("uniqid");

let logger = null;

if (!fs.existsSync(process.env.LOGS_LOCATION)) {
  fs.mkdirSync(process.env.LOGS_LOCATION);
}

const requestSerializer = req => ({
  method: req.method,
  url: req.url,
  // headers: req.headers,
  query: req.query,
  body: req.body,
});

const getLogger = () => {
  if (logger) {
    return logger;
  }
  logger = bunyan.createLogger({
    name: "Users Backend",
    serializers: {
      req: requestSerializer,
      err: bunyan.stdSerializers.err,
    },
    src: true,
    streams: [
      {
        level: "debug",
        stream: process.stdout,
      },

      {
        level: process.env.NODE_ENV === "local" ? "debug" : "info",
        type: "rotating-file",
        path: `${process.env.LOGS_LOCATION}/${process.env.LOGS_FILE_NAME}` || "./logs/be_users.log",
        period: process.env.LOGS_ROTATATION_PERIOD || "7d",
        count: parseInt(process.env.LOGS_ROTATATION_COPIES, 10) || 2,
      },
    ],
  });
  return logger;
};

module.exports = {
  getLogger,
};
