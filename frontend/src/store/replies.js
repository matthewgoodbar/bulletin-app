import jwtFetch from "./jwt";

const ADD_REPLY = "replies/ADD_REPLY";
const ADD_REPLIES = "replies/ADD_REPLIES";
const REMOVE_REPLY = "replies/REMOVE_REPLY";
const ADD_OR_SLIDE = "replies/ADD_OR_SLIDE";
const CLEAR_REPLIES = "replies/CLEAR_REPLIES";
const RECEIVE_REPLY_ERRORS = "replies/RECEIVE_REPLY_ERRORS";
const CLEAR_REPLY_ERRORS = "replies/CLEAR_REPLY_ERRORS";

//Actions
const addReply = reply => ({
    type: ADD_REPLY,
    reply,
});

const addReplies = replies => ({
    type: ADD_REPLIES,
    replies,
});

const removeReply = replyId => ({
    type: REMOVE_REPLY,
    replyId,
});

export const addOrSlideReply = reply => ({
    type: ADD_OR_SLIDE,
    reply,
});

export const clearReplies = () => ({
    type: CLEAR_REPLIES,
});

const receiveReplyErrors = errors => ({
    type: RECEIVE_REPLY_ERRORS,
    errors,
})

export const clearReplyErrors = () => ({
    type: CLEAR_REPLY_ERRORS,
});

// Thunk action creators
export const fetchReplies = postId => async dispatch => {
    try {
        const res = await jwtFetch(`/api/replies/post/${postId}`);
        const { replies } = await res.json();
        return dispatch(addReplies(replies));
    } catch (err) {
        const errBody = await err.json();
        if (errBody.statusCode === 400) {
            return dispatch(receiveReplyErrors(errBody.errors));
        }
    }
};

export const createReply = data => async dispatch => {
    try {
        const res = await jwtFetch(`/api/replies/${data.postId}`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        const { message } = await res.json();
        return dispatch(clearReplyErrors());
    } catch(err) {
        const errBody = await err.json();
        if (errBody.statusCode === 400) {
            return dispatch(receiveReplyErrors(errBody.errors));
        }
    }
};

//Reply errors reducer
const nullErrors = null;
export const replyErrorsReducer = (state=nullErrors, action) => {
    switch (action.type) {
        case RECEIVE_REPLY_ERRORS:
            return action.errors;
        case CLEAR_REPLY_ERRORS:
            return nullErrors;
        default:
            return state;
    }
};

//Replies reducer
const repliesReducer = (state={}, action) => {
    const newState = { ...state };
    switch (action.type) {
        case ADD_REPLY:
            return { ...state, [action.reply.id]: action.reply };
        case ADD_REPLIES:
            return { ...state, ...action.replies };
        case REMOVE_REPLY:
            delete newState[action.reply.id];
            return newState;
        case ADD_OR_SLIDE:
            newState[action.reply.id] = action.reply;
            const arr = Object.values(newState).sort((a,b) => new Date(a.updatedAt) - new Date(b.updatedAt));
            if (arr.length >= 100) {
                const oldId = arr[0].id;
                delete newState[oldId];
            }
            return newState;
        case CLEAR_REPLIES:
            return {};
        default:
            return newState;
    }
};

export default repliesReducer;