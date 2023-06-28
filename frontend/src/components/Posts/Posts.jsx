import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createPost, fetchPost, fetchPosts, addPost } from "../../store/posts";
import PostPreview from "../PostPreview";
import socket from "../../utils/socket";

const Posts = () => {

    const posts = useSelector(state => Object.values(state.posts).reverse());
    const currentUser = useSelector(state => state.session.currentUser);
    const [connected, setConnected] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {

        socket.connect();

        function connectionEstablished() {
            setConnected(true);
            dispatch(fetchPosts());
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
    }, [dispatch]);

    const onTestButton = e => {
        e.preventDefault();
        if (currentUser) {
            dispatch(createPost({
                authorId: currentUser.id,
                title: "My new favorite number is: " + Math.floor(Math.random() * 1000),
                body: "See title.",
            }));
        }
    };

    return (
        <>
            <div className="full-page-content">
                {connected &&
                <>
                    <div id="posts-box-preamble">
                        <Link to="/">Back to Homepage</Link>
                        <button onClick={onTestButton} disabled={!currentUser} >Here!</button>
                    </div>
                    <div id="posts-box">
                        <ul>
                            {posts &&
                            posts.map((post) => 
                                <PostPreview key={post.id} post={post} />
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