import { combineReducers } from "redux";
import { sessionErrorsReducer } from "./session";
import { postErrorsReducer } from "./posts";
import { replyErrorsReducer } from "./replies";

export default combineReducers({
    session: sessionErrorsReducer,
    posts: postErrorsReducer,
    replies: replyErrorsReducer,
});