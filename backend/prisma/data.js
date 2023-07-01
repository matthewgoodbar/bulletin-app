const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
const { Role } = require("@prisma/client");
const { ADMIN } = Role;
const _ = require('underscore');

const NUM_USERS = 20;
const NUM_POSTS = 400;
const NUM_REPLIES = 200;

const userSeeds = [];
userSeeds.push({
    username: "leibniz",
    hashedPassword: bcrypt.hashSync("password", 10),
});
userSeeds.push({
    username: "newton",
    hashedPassword: bcrypt.hashSync("password", 10),
});
for (let i = 0; i < NUM_USERS; i++) {
    userSeeds.push({
        username: faker.internet.userName(),
        hashedPassword: bcrypt.hashSync(faker.internet.password(), 10),
    });
}
userSeeds.push({
    username: "euler",
    hashedPassword: bcrypt.hashSync(process.env.ADMINPASS, 10),
    role: ADMIN,
});

const postSeeds = [];
const boards = ["A", "B", "C", "D"];
for (let i = 0; i < NUM_POSTS; i++) {
    postSeeds.push({
        authorId: Math.ceil(Math.random() * (NUM_USERS + 3)),
        title: `${faker.hacker.ingverb()} ${faker.hacker.noun()}`,
        body: `${faker.hacker.phrase()} ${faker.hacker.phrase()} ${faker.hacker.phrase()}`,
        board: _.sample(boards),
    });
}

const replySeeds = [];
for (let i = 0; i < NUM_REPLIES; i++) {
    replySeeds.push({
        authorId: Math.ceil(Math.random() * (NUM_USERS + 3)),
        postId: Math.ceil(Math.random() * NUM_POSTS),
        body: faker.hacker.phrase(),
    });
}

module.exports = {
    userSeeds,
    postSeeds,
    replySeeds,
}