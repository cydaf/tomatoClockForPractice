module.exports = {
    "type": "postgres",
    "host": process.env.POSTGRES_HOST || "localhost",
    "port": process.env.POSTGRES_PORT || 54320,
    "username": process.env.POSTGRES_USER || "postgres",
    "password": process.env.POSTGRES_PASSWORD || "Pass2020!",
    "database": process.env.POSTGRES_DB || "postgres",
    "synchronize": true,
    "logging": false,
    "entities": [
        "src/entity/*.ts"
    ]
}
