module.exports = {
    pgURL: process.env.DATABASE_URL,
    isProduction: process.env.NODE_ENV === 'production',
}