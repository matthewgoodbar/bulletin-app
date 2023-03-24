const { Client } = require('pg');
const d = require('debug');
const dbLog = d('backend:postgres');
const debug = d('backend:debug');
const serverLog = d('backend:server');
const bcrypt = require('bcryptjs');
const faker = require('@faker-js/faker');

const client = new Client();
(async () => {
    try {
        dbLog('Connecting to Postgres instance...');
        await client.connect();
        await client.query('BEGIN');

        await client.query('COMMIT');
        client.end()
        dbLog('Seeded successfully!');
    } catch (err) {
        await client.query('ROLLBACK');
        client.end();
        serverLog(err);
    }
})();