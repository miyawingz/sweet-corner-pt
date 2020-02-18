const bcrypt = require('./bcrypt');

module.exports = {
    compare: async (pw, hash) => {
        const isMatch = await bcrypt.compare(pw, hash);
        return isMatch;
    },
    generate: async (pw) => {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(pw, salt);
        return hash;
    }
};