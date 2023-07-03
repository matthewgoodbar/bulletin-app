const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
const { Role } = require("@prisma/client");
const { ADMIN } = Role;
const _ = require('underscore');

const NUM_USERS = 20;
const NUM_POSTS = 400;
const NUM_REPLIES = 200;

const userSeeds = [];
let date = faker.date.recent();
userSeeds.push({
    username: "leibniz",
    hashedPassword: bcrypt.hashSync("password", 10),
    createdAt: date,
    updatedAt: date,
});
date = faker.date.recent();
userSeeds.push({
    username: "newton",
    hashedPassword: bcrypt.hashSync("password", 10),
    createdAt: date,
    updatedAt: date,
});
for (let i = 0; i < NUM_USERS; i++) {
    date = faker.date.recent();
    userSeeds.push({
        username: faker.internet.userName(),
        hashedPassword: bcrypt.hashSync(faker.internet.password(), 10),
        createdAt: date,
        updatedAt: date,
    });
}
date = faker.date.recent();
userSeeds.push({
    username: "euler",
    hashedPassword: bcrypt.hashSync(process.env.ADMINPASS, 10),
    role: ADMIN,
    createdAt: date,
    updatedAt: date,
});

const postSeeds = [];
const boards = ["A", "B", "C", "D"];
for (let i = 0; i < NUM_POSTS; i++) {
    date = faker.date.recent();
    postSeeds.push({
        authorId: Math.ceil(Math.random() * (NUM_USERS + 3)),
        title: `${faker.hacker.ingverb()} ${faker.hacker.noun()}`,
        body: `${faker.hacker.phrase()} ${faker.hacker.phrase()} ${faker.hacker.phrase()}`,
        board: _.sample(boards),
        createdAt: date,
        updatedAt: date,
    });
}

const replySeeds = [];
for (let i = 0; i < NUM_REPLIES; i++) {
    date = faker.date.recent();
    replySeeds.push({
        authorId: Math.ceil(Math.random() * (NUM_USERS + 3)),
        postId: Math.ceil(Math.random() * NUM_POSTS),
        body: faker.hacker.phrase(),
        createdAt: date,
        updatedAt: date,
    });
}

module.exports = {
    userSeeds,
    postSeeds,
    replySeeds,
}