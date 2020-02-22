function GetIdInSQL(table, id) {
    return {
        text: `SELECT "id" FROM "${table}" WHERE "pid"=$1`,
        values: [id]
    }
}

module.exports.GetIdInSQL = GetIdInSQL;