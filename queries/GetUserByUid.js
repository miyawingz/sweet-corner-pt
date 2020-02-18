function GetUserByUid(uid) {
    return {
        text: `
        SELECT "firstName" ||' '|| "lastName" as "name", "email", "pid"
        FROM "users"
        WHERE "pid"=$1`,
        values: [uid]
    }
}

module.exports.GetUserByUid = GetUserByUid;