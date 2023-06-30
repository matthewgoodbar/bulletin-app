import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createPost, fetchPost, fetchPosts, addPost } from "../../store/posts";
import PostPreview from "../PostPreview";
import PostForm from "../PostForm";
import socket from "../../utils/socket";

const Posts = () => {

    const posts = useSelector(state => Object.values(state.posts).reverse());
    const currentUser = useSelector(state => state.session.currentUser);
    const [connected, setConnected] = useState(false);
    const [postFormOpen, setPostFormOpen] = useState(false);
    const dispatch = useDispatch();
    const scrollRef = useRef(null);

    const scrollToTop = () => scrollRef.current.scrollTo({ top: 0 });

    //Socket events
    function connectionEstablished() {
        setConnected(true);
        dispatch(fetchPosts());
    };

    function pullNewPost({ post }) {
        dispatch(addPost(post));
    };

    //Connecting & Disconnecting
    const handleConnect = e => {
        socket.connect();
        socket.on("connected", connectionEstablished);
        socket.on("pull new post", pullNewPost);
    };

    const handleDisconnect = e => {
        socket.off("connected", connectionEstablished);
        socket.off("pull new post", pullNewPost);
        socket.disconnect();
        setConnected(false);
    };

    //Connect on mount, disconnect on dismount
    useEffect(() => {
        handleConnect();
        return () => handleDisconnect();
    }, [dispatch]);

    let postButton;
    if (currentUser) {
        if (postFormOpen) {
            postButton = (
                <button onClick={e => setPostFormOpen(false)}>Close Post Form</button>
            );
        } else {
            postButton = (
                <button onClick={e => setPostFormOpen(true)}>Create New Post</button>
            );
        }
    } else {
        postButton = (
            <p>You must be <Link to="/login">logged in</Link> to post!</p>
        );
    }
    
    return (
        <>
            {postFormOpen &&
            <PostForm />
            }
            {connected &&
            <div id="posts-box">
                <div id="posts-header">
                    <h2>ALL POSTS</h2>
                    <button onClick={scrollToTop}>Back to Top</button>
                    {postButton}
                </div>
                <div id="posts-list" ref={scrollRef}>
                    <ul>
                        {posts &&
                        posts.map((post) => 
                            <PostPreview key={post.id} post={post} />
                        )}
                    </ul>
                </div>
            </div>
            }
            {!connected &&
            <p id="connecting-message" className="specific-page-content">
                Connecting...
            </p>
            }
        </>
    );
};

export default Posts;