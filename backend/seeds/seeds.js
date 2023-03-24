const { Client } = require('pg');
const d = require('debug');
const dbLog = d('backend:postgres');
const debug = d('backend:debug');
const serverLog = d('backend:server');
const bcrypt = require('bcryptjs');
const faker = require('@faker-js/faker');

const client = new Client();
client.connect()
    .then(() => {
        dbLog('Connected to Postgres Database...');
    })
    .catch(err => {
        serverLog(err);
    });
client.query
client.end();
