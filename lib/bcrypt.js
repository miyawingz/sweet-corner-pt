const bcrypt = require('bcrypt');
const { promisify } = require('util');

bcrypt.compare = promisify(bcrypt.compare);
bcrypt.genSalt = promisify(bcrypt.genSalt);
bcrypt.hash = promisify(bcrypt.hash);

module.exports = bcrypt;