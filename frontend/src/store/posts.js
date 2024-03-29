import jwtFetch from './jwt';

const ADD_POST = 'posts/ADD_POST';
const ADD_POSTS = 'posts/ADD_POSTS';
// const ADD_USER_POSTS = 'posts/ADD_USER_POSTS';
const REMOVE_POST = 'posts/REMOVE_POST';
const ADD_OR_SLIDE = 'posts/ADD_OR_SLIDE';
const CLEAR_POSTS = 'posts/CLEAR_POSTS';
const RECEIVE_POST_ERRORS = 'posts/RECEIVE_POST_ERRORS';
const CLEAR_POST_ERRORS = 'posts/CLEAR_POST_ERRORS';

export const addPost = post => ({
    type: ADD_POST,
    post,
});

const addPosts = posts => ({
    type: ADD_POSTS,
    posts,
});

// const addUserPosts = posts => ({
//     type: ADD_USER_POSTS,
//     posts,
// });

export const removePost = postId => ({
    type: REMOVE_POST,
    postId,
});

export const addOrSlide = post => ({
    type: ADD_OR_SLIDE,
    post,
})

export const clearPosts = () => ({
    type: CLEAR_POSTS,
});

const receivePostErrors = errors => ({
    type: RECEIVE_POST_ERRORS,
    errors,
});

export const clearPostErrors = errors => ({
    type: CLEAR_POST_ERRORS,
    errors,
});

// Thunk Actions
export const fetchPosts = () => async dispatch => {
    try {
        const res = await jwtFetch('/api/posts');
        const { posts } = await res.json();
        return dispatch(addPosts(posts));
    } catch(err) {
        const errBody = await err.json();
        if (errBody.statusCode === 400) {
            return dispatch(receivePostErrors(errBody.errors));
        }
    }
};

export const fetchBoard = boardId => async dispatch => {
    try {
        const res = await jwtFetch(`/api/posts/board/${boardId}`);
        const { posts } = await res.json();
        return dispatch(addPosts(posts));
    } catch (err) {
        const errBody = await err.json();
        if (errBody.statusCode === 400) {
            return dispatch(receivePostErrors(errBody.errors));
        }
    }
};

export const fetchPost = postId => async dispatch => {
    try {
        const res = await jwtFetch(`/api/posts/${postId}`);
        const { post } = await res.json();
        return dispatch(addPost(post));
    } catch(err) {
        const errBody = await err.json();
        if (errBody.statusCode === 400) {
            return dispatch(receivePostErrors(errBody.errors));
        }
    }
};

export const fetchUserPosts = userId => async dispatch => {
    try {
        const res = await jwtFetch(`/api/posts/author/${userId}`);
        const { posts } = await res.json();
        return dispatch(addPosts(posts));
    } catch(err) {
        const errBody = await err.json();
        if (errBody.statusCode === 400) {
            return dispatch(receivePostErrors(errBody.errors));
        }
    }
};

export const createPost = data => async dispatch => {
    try {
        const res = await jwtFetch('/api/posts', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        const { message } = await res.json();
        return dispatch(clearPostErrors());
    } catch(err) {
        const errBody = await err.json();
        if (errBody.statusCode === 400) {
            return dispatch(receivePostErrors(errBody.errors));
        }
    }
};

export const bumpPost = postId => async dispatch => {
    try {
        const res = await jwtFetch(`/api/posts/bump/${postId}`, {
            method: 'PATCH',
        });
        const { message } = await res.json();
    } catch(err) {
        const errBody = await err.json();
        if (errBody.statusCode === 400) {
            return dispatch(receivePostErrors(errBody.errors));
        }
    }
};

export const savePost = postId => async dispatch => {
    try {
        const res = await jwtFetch(`/api/posts/save/${postId}`, {
            method: 'PATCH',
        });
        const { message } = await res.json();
    } catch(err) {
        const errBody = await err.json();
        if (errBody.statusCode === 400) {
            return dispatch(receivePostErrors(errBody.errors));
        }
    }
};

// Post Errors Reducer
const nullErrors = null;

export const postErrorsReducer = (state = nullErrors, action) => {
    switch (action.type) {
        case RECEIVE_POST_ERRORS:
            return action.errors;
        case CLEAR_POST_ERRORS:
            return nullErrors;
        default:
            return state;
    }
};

// Posts Reducer
const postsReducer = (state = {}, action) => {
    const newState = { ...state }
    switch (action.type) {
        case ADD_POST:
            return { ...state, [action.post.id]: action.post };
        case ADD_POSTS:
            return { ...state, ...action.posts };
        case REMOVE_POST:
            delete newState[action.postId];
            return newState;
        case ADD_OR_SLIDE:
            newState[action.post.id] = action.post;
            const arr = Object.values(newState).sort((a,b) => new Date(a.updatedAt) - new Date(b.updatedAt));
            if (arr.length > 100) {
                const oldId = arr[0].id;
                delete newState[oldId];
            }
            return newState;
        case CLEAR_POSTS:
            return {};
        default:
            return newState;
    }
};

export default postsReducer;