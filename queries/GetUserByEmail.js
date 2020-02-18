function GetUserByEmail(email) {
    return {
        text: `
        SELECT "password" as "hash", "firstName" ||' '|| "lastName" as "name", "pid"
        FROM "users"
        WHERE "email"=$1
        `,
        values: [email]
    }
}

module.exports.GetUserByEmail = GetUserByEmail;