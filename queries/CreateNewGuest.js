function CreateNewGuest(email, firstName, lastName) {
    return {
        text: `INSERT INTO "guests"
                ("email","firstName","lastName")
                VALUES
                ($1,$2,$3)
                RETURNING "id"`,
        values: [email, firstName, lastName]
    }
}

module.exports.CreateNewGuest = CreateNewGuest;