import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createPost, fetchPost, fetchPosts } from "../../store/posts";
import socket from "../../utils/socket";

const Posts = () => {

    const posts = useSelector(state => Object.values(state.posts).reverse());
    // const [connectionEstablished, setConnectionEstablished] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    useEffect(() => {

        socket.connect();
        console.log("connected");

        function pullNewPost(postId) {
            dispatch(fetchPost(postId));
        };

        function testResponse(message) {
            console.log(message);
        };

        socket.on("pull new post", pullNewPost);
        socket.on("test response", testResponse);

        return () => {
            socket.off("pull new post", pullNewPost);
            socket.off("test response", testResponse);
            socket.disconnect();
            console.log("disconnected");
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