const { Prisma, PrismaClient } = require('@prisma/client');
const d = require('debug');
const dbLog = d('backend:postgres');
const serverLog = d('backend:server');

const prisma = new PrismaClient();
const { userSeeds, postSeeds, replySeeds } = require('./data.js');

const load = async () => {
    try {
        dbLog('Clearing data...');
        await prisma.reply.deleteMany();
        await prisma.post.deleteMany();
        await prisma.user.deleteMany();

        dbLog('Resetting PK sequences...');
        await prisma.$queryRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1;`
        await prisma.$queryRaw`ALTER SEQUENCE "Post_id_seq" RESTART WITH 1;`
        await prisma.$queryRaw`ALTER SEQUENCE "Reply_id_seq" RESTART WITH 1;`

        dbLog('Adding User data...');
        await prisma.user.createMany({
            data: userSeeds,
        });

        dbLog('Adding Post data...');
        await prisma.post.createMany({
            data: postSeeds,
        });

        dbLog('Adding Reply data...');
        await prisma.reply.createMany({
            data: replySeeds,
        });

        dbLog('Done!');

    } catch (err) {
        serverLog(err);
    } finally {
        await prisma.$disconnect();
    }
};

load();