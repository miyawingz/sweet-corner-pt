function emailValidate(email) {
    const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/;
    return emailRegex.test(email.toUpperCase());
}

function passwordValidate(pw) {
    const length = pw.length >= 8;
    const upperCase = /[A-Z]/.test(pw);
    const lowerCase = /[a-z]/.test(pw);
    const number = /[0-9]/.test(pw);
    const specialChar = /[^[A-Za-z0-9]/.test(pw);
    return length && upperCase && lowerCase && number && specialChar;
}

module.exports.emailValidate = emailValidate;
module.exports.passwordValidate = passwordValidate;