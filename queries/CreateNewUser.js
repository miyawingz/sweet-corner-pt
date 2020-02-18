function CreateNewUser(email, firstName, lastName, password) {
    return {
        text: `
            INSERT INTO "users" ("email", "firstName", "lastName","password","createdAt")
            VALUES ($1, $2, $3, $4, now())
            RETURNING "firstName" ||' '|| "lastName" as "name", "email", "pid"
        `,
        values: [email, firstName, lastName, password]
    }
}

module.exports.CreateNewUser = CreateNewUser;