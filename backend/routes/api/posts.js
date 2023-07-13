const express = require('express');
const router = express.Router();
const { Prisma, PrismaClient } = require('@prisma/client');
const { Board } = require('@prisma/client');
const validatePostInput = require('../../validations/posts');
const { requireUser } = require('../../config/passport');
const { formatPosts, formatPost } = require('../../utils/format');
const socket = require('../../utils/socket');

const prisma = new PrismaClient();
const includeOptions = {
    author: {
        select: {
            username: true,
            icon: true,
        },
    },
    _count: {
        select: { replies: true },
    },
    savedBy: {
        select: { id: true }
    },
};

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
            include: includeOptions,
            orderBy: {
                updatedAt: 'desc',
            },
            take: 100,
        });
        res.json({
            posts: formatPosts(queriedPosts),
        });
    } catch (err) {
        return next(err);
    }
});

router.get('/author/:authorId', async (req, res, next) => {
    try {
        const { authorId } = req.params;
        const queriedPosts = await prisma.post.findMany({
            where: {
                authorId: parseInt(authorId),
            },
            include: includeOptions,
            orderBy: {
                updatedAt: 'desc',
            },
        });
        res.json({
            posts: formatPosts(queriedPosts),
        });
    } catch (err) {
        return next(err);
    }
});

router.get('/saved/:userId', async (req, res, next) => {
    try {
        const { userId } = req.params;
        const queriedUser = await prisma.user.findUnique({
            where: {
                id: parseInt(userId),
            },
            include: {
                savedPosts: {
                    include: includeOptions,
                },
            },
        });
        res.json({
            posts: formatPosts(queriedUser.savedPosts),
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
            include: includeOptions,
        });
        res.json({
            post: formatPost(queriedPost),
        });
    } catch (err) {
        return next(err);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const queriedPosts = await prisma.post.findMany({
            include: includeOptions,
            orderBy: {
                updatedAt: 'desc',
            },
            take: 100,
        });
        res.json({
            posts: formatPosts(queriedPosts),
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
                authorId: parseInt(id),
                board: board,
            },
            include: includeOptions,
        });
        socket.emit("publish post", formatPost(post));
        res.json({
            message: "success",
        });
    } catch (err) {
        return next(err);
    }
});

router.patch('/bump/:id', async (req, res, next) => {
    try {
        socket.connect();
        const { id } = req.params;
        const post = await prisma.post.update({
            where: {
                id: parseInt(id),
            },
            data: {
                bumps: {
                    increment: 1,
                }
            },
            include: includeOptions,
        });
        socket.emit("publish post", formatPost(post));
        res.json({
            message: "success",
        });
    } catch (err) {
        return next(err);
    }
});

router.patch('/save/:id', requireUser, async (req, res, next) => {
    try {
        socket.connect();
        const { id } = req.params;
        const userId = req.user.id;
        const post = await prisma.post.update({
            where: {
                id: parseInt(id),
            },
            data: {
                savedBy: {
                    connect: { id: parseInt(userId) },
                },
            },
            include: includeOptions,
        });
        socket.emit("publish post", formatPost(post));
        res.json({
            message: "success",
        });
    } catch (err) {
        return next(err);
    }
});

router.patch('/:id', requireUser, validatePostInput, async (req, res, next) => {
    try {
        socket.connect();
        const { title, body } = req.body;
        const { id } = req.params;
        const post = await prisma.post.update({
            where: {
                id: parseInt(id),
            },
            data: {
                title,
                body,
            },
            include: includeOptions,
        });
        socket.emit("publish post", formatPost(post));
        res.json({
            message: "success",
        });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;