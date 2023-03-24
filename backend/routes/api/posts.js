const express = require('express');
const router = express.Router();
const db = require('../../db');
const validatePostInput = require('../../validations/posts');
const { requireUser } = require('../../config/passport');

const postReturnFormat = 'posts.id, posts.title, posts.body, posts."userId", posts."createdAt"';

router.get('/user/:userId', async (req, res, next) => {
    try {
        const dbQuery = await db.query(
            `SELECT ${postReturnFormat} 
            FROM posts 
            WHERE posts."userId" = $1`,
            [req.params.userId]
            );
        res.json({
            posts: dbQuery.rows,
        });
    } catch (err) {
        return next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const dbQuery = await db.query(
            `SELECT ${postReturnFormat} 
            FROM posts
            WHERE posts.id = $1`,
            [req.params.id]
            );
        res.json({
            post: dbQuery.rows[0],
        });
    } catch (err) {
        return next(err);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const dbQuery = await db.query(`SELECT ${postReturnFormat} FROM posts`);
        return res.json({
            posts: dbQuery.rows,
        });
    } catch (err) {
        return next(err);
    }
});

router.post('/', requireUser, validatePostInput, async (req, res, next) => {
    try {
        const text = `INSERT INTO posts(title, body, "userId") VALUES($1, $2, $3) RETURNING ${postReturnFormat}`;
        const values = [req.body.title, req.body.body, req.user.id];
        const dbQuery = await db.query(text, values);
        res.json({
            post: dbQuery.rows[0]
        })
    } catch (err) {
        return next(err);
    }
});

module.exports = router;