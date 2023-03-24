module.exports = {
    secretOrKey: process.env.SECRET_OR_KEY,
    pgURL: process.env.DATABASE_URL,
    isProduction: process.env.NODE_ENV === 'production',
}