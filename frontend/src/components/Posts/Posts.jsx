import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPosts } from "../../store/posts";
import socket from "../../utils/socket";

const Posts = () => {

    const posts = useSelector(state => Object.values(state.posts));
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    return (
        <>
            <div id="posts-box">
                <ul>
                    <Link to="/">Back to Homepage</Link>
                    {posts &&
                    posts.map((post) => 
                        <li>
                            <ul>
                                <li>{post.id}</li>
                                <li>{post.title}</li>
                                <li>{post.body}</li>
                                <li>{post.createdAt}</li>
                            </ul>
                        </li>
                    )}
                </ul>
            </div>
        </>
    );
};

export default Posts;