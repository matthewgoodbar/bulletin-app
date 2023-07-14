const express = require('express');
const router = express.Router();
const { Prisma, PrismaClient } = require('@prisma/client');
const { Board } = require('@prisma/client');
const { requireUser, restoreUser } = require('../../config/passport');
const { formatArray } = require('../../utils/format');
const socket = require('../../utils/socket');

const prisma = new PrismaClient();
const includeOptions = {
    author: {
        select: { username: true },
    },
    post: {
        select: { board: true },
    },
};

router.get('/post/:postId', async (req, res, next) => {
    try {
        const { postId } = req.params;
        const replies = await prisma.reply.findMany({
            where: {
                postId: parseInt(postId),
            },
            include: includeOptions,
            orderBy: {
                updatedAt: 'desc',
            },
            take: 100,
        });
        const formattedReplies = formatArray(replies);
        res.json({
            replies: formattedReplies,
        });
    } catch(err) {
        return next(err);
    }
});

router.get('/author/authorId', async (req, res, next) => {
    try {
        const { authorId } = req.params;
        const replies = await prisma.reply.findMany({
            where: {
                authorId: parseInt(authorId),
            },
            include: includeOptions,
            orderBy: {
                updatedAt: 'desc',
            },
        });
        const formattedReplies = formatArray(replies);
        res.json({
            replies: formattedReplies,
        });
    } catch(err) {
        return next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const reply = await prisma.reply.findUnique({
            where: {
                id: parseInt(id),
            },
            include: includeOptions,
        });
        res.json({
            reply: reply,
        })
    } catch(err) {
        return next(err);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const replies = await prisma.reply.findMany({
            include: includeOptions,
            orderBy: {
                updatedAt: 'desc',
            },
            take: 100,
        });
        const formattedReplies = formatArray(replies);
        res.json({
            replies: formattedReplies,
        });
    } catch(err) {
        return next(err);
    }
});

router.post('/:postId', restoreUser, async (req, res, next) => {
    try {
        socket.connect();
        const { postId, body } = req.body;
        const authorId = req.user.id;
        const reply = await prisma.reply.create({
            data: {
                authorId: parseInt(authorId),
                postId: parseInt(postId),
                body: body,
            },
            include: includeOptions,
        });
        socket.emit("publish reply", reply);
        res.json({
            message: "success"
        });
    } catch(err) {
        return next(err);
    }
});

module.exports = router;