/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {

    // pgm.dropTable('posts', { ifExists: true, cascade: true });
    // pgm.dropTable('users', { ifExists: true, cascade: true });

    pgm.createTable('users', {
        id: 'id',
        username: {
            type: 'varchar(20)',
            notNull: true,
            unique: true,
        },
        hashedPassword: {
            type: 'string',
            notNull: true,
        },
        createdAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });
    pgm.createTable('posts', {
        id: 'id',
        userId: {
            type: 'integer',
            notNull: true,
            references: '"users"',
            onDelete: 'cascade',
        },
        title: {
            type: 'varchar(40)',
            notNull: true,
        },
        body: {
            type: 'text',
            notNull: true,
        },
        createdAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });
    pgm.createTable('replies', {
        id: 'id',
        userId: {
            type: 'integer',
            notNull: true,
            references: '"users"',
            onDelete: 'cascade',
        },
        postId: {
            type: 'integer',
            notNull: true,
            references: '"posts"',
            onDelete: 'cascade',
        },
        body: {
            type: 'text',
            notNull: true,
        },
        createdAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });
    pgm.createIndex('posts', 'userId');
    pgm.createIndex('replies', 'userId');
    pgm.createIndex('replies', 'postId');
};

exports.down = pgm => {};
