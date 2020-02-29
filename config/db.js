module.exports={
    connectionString:`postgresql://${process.env.DBUSER}:${process.env.DBPW}@${process.env.DBURL}/${process.env.DBTABLE}`
}

