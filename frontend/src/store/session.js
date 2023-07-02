import jwtFetch from "./jwt";

const RECEIVE_CURRENT_USER = "session/RECEIVE_CURRENT_USER";
const RECEIVE_SESSION_ERRORS = "session/RECEIVE_SESSION_ERRORS";
const CLEAR_SESSION_ERRORS = "session/CLEAR_SESSION_ERRORS";
const RECEIVE_USER_LOGOUT = "session/RECEIVE_USER_LOGOUT";
const SET_LAST_BOARD = "session/SET_LAST_BOARD";

const receiveCurrentUser = currentUser => ({
    type: RECEIVE_CURRENT_USER,
    currentUser,
});

const receiveSessionErrors = errors => ({
    type: RECEIVE_SESSION_ERRORS,
    errors,
});

export const clearSessionErrors = () => ({
    type: CLEAR_SESSION_ERRORS,
});

const logoutUser = () => ({
    type: RECEIVE_USER_LOGOUT,
});

export const setLastBoard = board => ({
    type: SET_LAST_BOARD,
    board,
});

// Thunk Actions
export const signup = user =>  startSession(user, '/api/users/register');
export const login = user => startSession(user, '/api/users/login');

const startSession = (userInfo, route) => async dispatch => {
    try {
        const res = await jwtFetch(route, {
            method: 'POST',
            body: JSON.stringify(userInfo),
        });
        const { user, token } = await res.json();
        localStorage.setItem('jwtToken', token);
        return dispatch(receiveCurrentUser(user));
    } catch (err) {
        const res = await err.json();
        if (res.statusCode === 400) {
            return dispatch(receiveSessionErrors(res.errors));
        }
    }
};

export const logout = () => dispatch => {
    localStorage.removeItem('jwtToken');
    return dispatch(logoutUser());
};

export const getCurrentUser = () => async dispatch => {
    const res = await jwtFetch('/api/users/current');
    const { user } = await res.json();
    return dispatch(receiveCurrentUser(user));
};

// Session Errors Reducer
const nullErrors = null;

export const sessionErrorsReducer = (state = nullErrors, action) => {
    switch(action.type) {
        case RECEIVE_SESSION_ERRORS:
            return action.errors;
        case RECEIVE_CURRENT_USER:
        case CLEAR_SESSION_ERRORS:
            return nullErrors;
        default:
            return state;
    }
};

// Session Reducer
const initialState = {
    currentUser: undefined,
    lastBoard: "A",
};

const sessionReducer = (state = initialState, action) => {
    // const newState = { ...state };
    switch (action.type) {
        case RECEIVE_CURRENT_USER:
            return { ...state, currentUser: action.currentUser };
        case RECEIVE_USER_LOGOUT:
            return { ...state, currentUser: undefined };
        case SET_LAST_BOARD:
            return { ...state, lastBoard: action.board };
        default:
            return state;
    }
};

export default sessionReducer;