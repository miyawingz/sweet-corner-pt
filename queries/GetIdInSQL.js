function GetIdInSQL(id, table) {
    //check status returned from query? avoid embedding logic in this query? 
    //select statusId regardless and just set default to null?
    if (table == 'carts') {
        return {
            text: `SELECT "id" FROM "${table}" 
                   WHERE "pid"=$1 AND "statusId"<=$2 
                   ORDER BY "statusId" DESC;`,
            values: [id, 2]
        }
    }

    return {
        text: `SELECT "id" FROM "${table}" WHERE "pid"=$1`,
        values: [id]
    }
}

module.exports.GetIdInSQL = GetIdInSQL;