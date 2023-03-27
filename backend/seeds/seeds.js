const { Client } = require('pg');
const pgFormat = require('pg-format');
const d = require('debug');
const dbLog = d('backend:postgres');
const debug = d('backend:debug');
const serverLog = d('backend:server');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

const NUM_USERS = 20;
const USERS_QUERY_TEXT = 'INSERT INTO users (username, "hashedPassword") VALUES %L';

const NUM_POSTS = 80;
const POSTS_QUERY_TEXT = 'INSERT INTO posts ("userId", title, body) VALUES %L';

const NUM_REPLIES = 80;
const REPLIES_QUERY_TEXT = 'INSERT INTO replies ("userId", "postId", body) VALUES %L';

const userSeeds = [];
userSeeds.push([
    "matthew",
    bcrypt.hashSync("password", 10)
]);
for (let i = 0; i < NUM_USERS; i++) {
    userSeeds.push([
        faker.internet.userName(),
        bcrypt.hashSync(faker.internet.password(), 10),
    ]);
}

const postSeeds = [];
for (let i = 0; i < NUM_POSTS; i++) {
    postSeeds.push([
        Math.ceil(Math.random() * NUM_USERS),
        faker.lorem.words(3),
        faker.lorem.sentences(5),
    ])
}

const replySeeds = [];
for (let i = 0; i < NUM_REPLIES; i++) {
    replySeeds.push([
        Math.ceil(Math.random() * NUM_USERS),
        Math.ceil(Math.random() * NUM_POSTS),
        faker.lorem.sentences(5),
    ])
}

const client = new Client();
(async () => {
    try {
        dbLog('Connecting to Postgres instance...');
        await client.connect();
        await client.query('BEGIN');

        dbLog('Clearing tables...');
        await client.query('DELETE FROM replies');
        await client.query('DELETE FROM posts');
        await client.query('DELETE FROM users');

        dbLog('Resetting PK sequences...');
        // await client.query('ALTER SEQUENCE replies_userId_seq RESTART WITH 1');
        // await client.query('ALTER SEQUENCE "replies_postId_seq" RESTART WITH 1');
        await client.query('ALTER SEQUENCE "replies_id_seq" RESTART WITH 1');
        // await client.query('ALTER SEQUENCE "posts_userId_seq" RESTART WITH 1');
        await client.query('ALTER SEQUENCE "posts_id_seq" RESTART WITH 1');
        await client.query('ALTER SEQUENCE "users_id_seq" RESTART WITH 1');

        dbLog('Seeding users...');
        await client.query(pgFormat(USERS_QUERY_TEXT, userSeeds));
        dbLog('Seeding posts...');
        await client.query(pgFormat(POSTS_QUERY_TEXT, postSeeds));
        dbLog('Seeding replies...');
        await client.query(pgFormat(REPLIES_QUERY_TEXT, replySeeds));
        
        await client.query('COMMIT');
        client.end()
        dbLog('Seeded successfully!');
    } catch (err) {
        await client.query('ROLLBACK');
        client.end();
        serverLog(err);
    }
})();