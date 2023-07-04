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

const addOrSlideReply = reply => ({
    type: ADD_OR_SLIDE,
    reply,
});

const clearReplies = () => ({
    type: CLEAR_REPLIES,
});

const receiveReplyErrors = errors => ({
    type: RECEIVE_REPLY_ERRORS,
    errors,
})

const clearReplyErrors = () => ({
    type: CLEAR_REPLY_ERRORS,
});

// Thunk action creators
const fetchReplies = postId => async dispatch => {
    try {
        // const res = await jwtFetch(`/api/`)
    } catch (err) {
        const errBody = await err.json();
        if (errBody.statusCode === 400) {
            return dispatch(receiveReplyErrors(errBody.errors));
        }
    }
};

const nullErrors = null;
export const replyErrorsReducer = (state=nullErrors, action) => {

}

const repliesReducer = (state={}, action) => {

};

export default repliesReducer;