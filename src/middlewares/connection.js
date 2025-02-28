require('dotenv').config()
const mysql = require('mysql2/promise')

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env

const pool = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    multipleStatements: true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

const connection = async (req, res, next) => {

    try {

        req.database = await pool.getConnection()
        await req.database.ping()

        next()
        
    } catch (error) {
        console.error('Error connecting to the database:', error.message)
        next(error)
    }

    res.on('finish', () => {
        if (req.database) req.database.release()
    })

}

module.exports = connection