import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createPost, fetchPost, fetchPosts, addPost } from "../../store/posts";
import socket from "../../utils/socket";
import { partialTimestamp } from "../../utils/date";

const Posts = () => {

    const posts = useSelector(state => Object.values(state.posts).reverse());
    const [connected, setConnected] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    useEffect(() => {

        socket.connect();

        function connectionEstablished() {
            setConnected(true);
        }

        function pullNewPost({ post }) {
            dispatch(addPost(post));
        };


        socket.on("connected", connectionEstablished);
        socket.on("pull new post", pullNewPost);

        return () => {
            socket.off("connected", connectionEstablished);
            socket.off("pull new post", pullNewPost);
            socket.disconnect();
            setConnected(false);
        };
    }, []);

    const onTestButton = e => {
        e.preventDefault();
        // socket.emit("test", "This is a test message from " + socket.id);
        dispatch(createPost({
            authorId: 1,
            title: "My new favorite number is: " + Math.floor(Math.random() * 1000),
            body: "See title.",
        }));
    };

    return (
        <>
            <div className="full-page-content">
                {connected &&
                <>
                    <div id="posts-box-preamble">
                        <Link to="/">Back to Homepage</Link>
                        <form onSubmit={onTestButton}>
                            <input type="submit" 
                                value="Here!"
                            />
                        </form>
                    </div>
                    <div id="posts-box">
                        <ul>
                            {posts &&
                            posts.map((post) => 
                                <li className="single-post" key={post.id}>
                                    <ul>
                                        <li>ID: {post.id}</li>
                                        <li>Posted by: {post.author.username}</li>
                                        <li>{post.title}</li>
                                        <li>{post.body}</li>
                                        <li>{partialTimestamp(post.createdAt)}</li>
                                    </ul>
                                </li>
                            )}
                        </ul>
                    </div>
                </>
                }
                {!connected &&
                <p>Connecting...</p>
                }
            </div>
        </>
    );
};

export default Posts;