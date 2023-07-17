import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { clearPosts } from "../../store/posts";
import { clearUsers, fetchUser } from "../../store/users";

const User = () => {

    const dispatch = useDispatch();
    const { userId } = useParams();
    const user = useSelector(state => state.users[userId]);

    useEffect(() => {
        dispatch(clearPosts());
        dispatch(clearUsers());
        dispatch(fetchUser(userId));
    }, [dispatch, userId]);

    return (
        <div id="form-and-box">
            <div id="user-box">
                {user &&
                <ul>
                    <li>{user.id}</li>
                    <li>{user.username}</li>
                    <li>{user.bio}</li>
                </ul>
                }
            </div>
        </div>
    );
};

export default User;