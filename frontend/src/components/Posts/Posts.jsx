import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPosts } from "../../store/posts";
import socket from "../../utils/socket";

const Posts = () => {

    const posts = useSelector(state => Object.values(state.posts).reverse());
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    return (
        <>
            <div className="full-page-content">
                <div id="posts-box-preamble">
                    <Link to="/">Back to Homepage</Link>
                </div>
                <div id="posts-box">
                    <ul>
                        {posts &&
                        posts.map((post) => 
                            <li className="single-post">
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
            </div>
        </>
    );
};

export default Posts;