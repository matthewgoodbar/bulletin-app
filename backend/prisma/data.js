const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

const NUM_USERS = 22;
const NUM_POSTS = 80;
const NUM_REPLIES = 80;

const userSeeds = [];
userSeeds.push({
    username: "leibniz",
    hashedPassword: bcrypt.hashSync("password", 10)
});
userSeeds.push({
    username: "newton",
    hashedPassword: bcrypt.hashSync("password", 10)
});
for (let i = 0; i < NUM_USERS; i++) {
    userSeeds.push({
        username: faker.internet.userName(),
        hashedPassword: bcrypt.hashSync(faker.internet.password(), 10),
    });
}

const postSeeds = [];
for (let i = 0; i < NUM_POSTS; i++) {
    postSeeds.push({
        authorId: Math.ceil(Math.random() * NUM_USERS),
        title: faker.lorem.words(3),
        body: faker.lorem.sentences(5),
    })
}

const replySeeds = [];
for (let i = 0; i < NUM_REPLIES; i++) {
    replySeeds.push({
        authorId: Math.ceil(Math.random() * NUM_USERS),
        postId: Math.ceil(Math.random() * NUM_POSTS),
        body: faker.lorem.sentences(5),
    })
}

module.exports = {
    userSeeds,
    postSeeds,
    replySeeds,
}