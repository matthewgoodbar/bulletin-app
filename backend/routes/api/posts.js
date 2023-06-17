const express = require('express');
const router = express.Router();
const { Prisma, PrismaClient } = require('@prisma/client');
const validatePostInput = require('../../validations/posts');
const { requireUser } = require('../../config/passport');

const prisma = new PrismaClient();

router.get('/author/:authorId', async (req, res, next) => {
    try {
        const { authorId } = req.params;
        const queriedPosts = await prisma.post.findMany({
            where: {
                authorId: parseInt(authorId),
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
                id: id,
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
        const queriedPosts = await prisma.post.findMany();
        res.json({
            posts: queriedPosts,
        });
    } catch (err) {
        return next(err);
    }
});

router.post('/', requireUser, validatePostInput, async (req, res, next) => {
    try {
        const { title, body } = req.body;
        const { id } = req.user;
        const post = await prisma.post.create({
            data: {
                title: title,
                body: body,
                authorId: id,
            },
        });
        res.json({
            post: post,
        });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;