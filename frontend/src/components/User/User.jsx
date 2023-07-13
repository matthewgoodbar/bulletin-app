import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { clearPosts } from "../../store/posts";

const User = () => {

    const dispatch = useDispatch();
    const { userId } = useParams();

    useEffect(() => {
        dispatch(clearPosts());
    }, [dispatch, userId]);

    return (
        <div id="form-and-box">
            <div id="user-box">

            </div>
        </div>
    );
};

export default User;