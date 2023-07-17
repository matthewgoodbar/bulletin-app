import { combineReducers } from "redux";
import { sessionErrorsReducer } from "./session";
import { userErrorsReducer } from "./users";
import { postErrorsReducer } from "./posts";
import { replyErrorsReducer } from "./replies";

export default combineReducers({
    session: sessionErrorsReducer,
    users: userErrorsReducer,
    posts: postErrorsReducer,
    replies: replyErrorsReducer,
});