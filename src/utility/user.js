const crypto = require('crypto');

const generateHashAndSalt = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt,
    1000, 64, 'sha512').toString('hex'); 
  return { 
    salt,
    hash,
  };
};


const isPasswordValid = (salt, inputHash, password) => {
  const hash = crypto.pbkdf2Sync(password, salt,
    1000, 64, 'sha512').toString('hex');
  return inputHash === hash;
};

module.exports = {
  generateHashAndSalt,
  isPasswordValid,
};
