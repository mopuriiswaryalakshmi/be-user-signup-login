// const mongoose = require('mongoose');
// mongoose.Promise = global.Promise;

// mongoose.connect('mongodb://localhost:27017/task_1', { useNewUrlParser: true }).then((res) => {
//     console.log('connected to db')
// }).catch((error) => {
//     console.log(err);
// })

// const secret = 'this is some secret';

// module.exports = {
//     mongoose,
//     secret
// }

const apiPathDetails = {
  apiVersion: "v1",
  basePath: "/api"
};

const secret = process.env.JWT_SECRET;

module.exports = {
  apiPathDetails,
  secret
};
