const express = require('express');
const router = express.Router();
const db = require('../../db');
const { Prisma, PrismaClient } = require('@prisma/client');
const validatePostInput = require('../../validations/posts');
const { requireUser } = require('../../config/passport');

const postReturnFormat = 'posts.id, posts.title, posts.body, posts."userId", posts."createdAt"';
const prisma = new PrismaClient();

router.get('/author/:authorId', async (req, res, next) => {
    try {
        const { authorId } = req.params;
        // const dbQuery = await db.query(
        //     `SELECT ${postReturnFormat} 
        //     FROM posts 
        //     WHERE posts."userId" = $1`,
        //     [req.params.userId]
        //     );
        // res.json({
        //     posts: dbQuery.rows,
        // });
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
        // const dbQuery = await db.query(
        //     `SELECT ${postReturnFormat} 
        //     FROM posts
        //     WHERE posts.id = $1`,
        //     [req.params.id]
        //     );
        // res.json({
        //     post: dbQuery.rows[0],
        // });
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
        // const dbQuery = await db.query(`SELECT ${postReturnFormat} FROM posts`);
        // return res.json({
        //     posts: dbQuery.rows,
        // });
        const queriedPosts = await prisma.post.findMany();
        res.json({
            posts: queriedPosts,
        });
    } catch (err) {
        return next(err);
    }
});

router.post('/', requireUser, validatePostInput, async (req, res, next) => {
    // const client = await db.getClient();
    try {
        const { title, body } = req.body;
        const { id } = req.user;
        // const text = `INSERT INTO posts(title, body, "userId") VALUES($1, $2, $3) RETURNING ${postReturnFormat}`;
        // const values = [req.body.title, req.body.body, req.user.id];
        // await client.query('BEGIN');
        // const dbQuery = await client.query(text, values);
        // await client.query('COMMIT');
        // client.release();
        // res.json({
        //     post: dbQuery.rows[0]
        // })
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
        // await client.query('ROLLBACK');
        // client.release();
        return next(err);
    }
});

module.exports = router;