import jwtFetch from "./jwt";

const ADD_USER = 'users/ADD_USER';
const ADD_USERS = 'users/ADD_USERS';
const REMOVE_USER = 'users/REMOVE_USER';
const CLEAR_USERS = 'users/CLEAR_USERS';
const RECEIVE_USER_ERRORS = 'users/RECEIVE_USER_ERRORS';
const CLEAR_USER_ERRORS = 'users/CLEAR_USER_ERRORS';

export const addUser = user => ({
    type: ADD_USER,
    user,
});

const addUsers = users => ({
    type: ADD_USERS,
    users,
});

export const removeUser = userId => ({
    type: REMOVE_USER,
    userId,
});


export const clearUsers = () => ({
    type: CLEAR_USERS,
});

const receiveUserErrors = errors => ({
    type: RECEIVE_USER_ERRORS,
    errors,
});

export const clearUserErrors = errors => ({
    type: CLEAR_USER_ERRORS,
    errors,
});

// Thunk Actions
export const fetchUsers = () => async dispatch => {
    try {
        const res = await jwtFetch('/api/users');
        const { users } = await res.json();
        return dispatch(addUsers(users));
    } catch(err) {
        const errBody = await err.json();
        if (errBody.statusCode === 400) {
            return dispatch(receiveUserErrors(errBody.errors));
        }
    }
};

export const fetchUser = userId => async dispatch => {
    try {
        const res = await jwtFetch(`/api/users/${userId}`);
        const { user } = await res.json();
        return dispatch(addUser(user));
    } catch(err) {
        const errBody = await err.json();
        if (errBody.statusCode === 400) {
            return dispatch(receiveUserErrors(errBody.errors));
        }
    }
};

//User errors reducer
const nullErrors = null;
export const userErrorsReducer = (state = nullErrors, action) => {
    switch (action.type) {
        case RECEIVE_USER_ERRORS:
            return action.errors;
        case CLEAR_USER_ERRORS:
            return nullErrors;
        default:
            return state;
    }
}

//Users Reducer
const usersReducer = (state = {}, action) => {
    const newState = { ...state }
    switch (action.type) {
        case ADD_USER:
            return { ...state, [action.user.id]: action.user };
        case ADD_USERS:
            return { ...state, ...action.users };
        case REMOVE_USER:
            delete newState[action.userId];
            return newState;
        case CLEAR_USERS:
            return {};
        default:
            return newState;
    }
}

export default usersReducer;