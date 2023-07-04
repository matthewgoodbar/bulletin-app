const express = require('express');
const router = express.Router();
const { Prisma, PrismaClient } = require('@prisma/client');
const { Board } = require('@prisma/client');
const validatePostInput = require('../../validations/posts');
const { requireUser } = require('../../config/passport');
const { formatArray } = require('../../utils/format');
const socket = require('../../utils/socket');

const prisma = new PrismaClient();

router.get('/author/:authorId', async (req, res, next) => {
    try {
        const { authorId } = req.params;
        const queriedPosts = await prisma.post.findMany({
            where: {
                authorId: parseInt(authorId),
            },
            include: {
                author: {
                    select: { username: true },
                },
                _count: {
                    select: { replies: true },
                },
            },
        });
        res.json({
            posts: queriedPosts,
        });
    } catch (err) {
        return next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const queriedPost = await prisma.post.findUnique({
            where: {
                id: parseInt(id),
            },
            include: {
                author: {
                    select: { username: true },
                },
                _count: {
                    select: { replies: true },
                },
            },
        });
        res.json({
            post: queriedPost,
        });
    } catch (err) {
        return next(err);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const queriedPosts = await prisma.post.findMany({
            include: {
                author: {
                    select: { username: true },
                },
                _count: {
                    select: { replies: true },
                },
            },
            orderBy: {
                updatedAt: 'desc',
            },
            take: 100,
        });
        const formattedPosts = formatArray(queriedPosts);
        res.json({
            posts: formattedPosts,
        });
    } catch (err) {
        return next(err);
    }
});

router.get('/board/:boardId', async (req, res, next) => {
    try {
        let { boardId } = req.params;
        if (!Board[boardId]) {
            boardId = "A";
        }
        const queriedPosts = await prisma.post.findMany({
            where: {
                board: boardId,
            },
            include: {
                author: {
                    select: { username: true },
                },
                _count: {
                    select: { replies: true },
                },
            },
            orderBy: {
                updatedAt: 'desc',
            },
            take: 100,
        });
        const formattedPosts = formatArray(queriedPosts);
        res.json({
            posts: formattedPosts,
        });
    } catch (err) {
        return next(err);
    }
});

router.post('/', requireUser, validatePostInput, async (req, res, next) => {
    try {
        socket.connect();
        const { title, body, board } = req.body;
        const { id } = req.user;
        const post = await prisma.post.create({
            data: {
                title: title,
                body: body,
                authorId: id,
                board: board,
            },
        });
        const postToSendBack = await prisma.post.findUnique({
            where: {
                id: post.id,
            },
            include: {
                author: {
                    select: { username: true },
                },
                _count: {
                    select: { replies: true },
                },
            },
        });
        socket.emit("publish new post", postToSendBack);
        res.json({
            post: post,
        });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;