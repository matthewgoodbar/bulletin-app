import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPosts, addPost, clearPosts, fetchBoard } from "../../store/posts";
import PostPreview from "../PostPreview";
import PostForm from "../PostForm";
import socket from "../../utils/socket";
import { setLastBoard } from "../../store/session";

const Posts = ({ displayBoard = "A" }) => {

    const posts = useSelector(state => Object.values(state.posts).reverse());
    const currentUser = useSelector(state => state.session.currentUser);
    const [connected, setConnected] = useState(false);
    const [postFormOpen, setPostFormOpen] = useState(false);
    const [board, setBoard] = useState(displayBoard);
    const dispatch = useDispatch();
    const scrollRef = useRef(null);

    const scrollToTop = () => scrollRef.current.scrollTo({ top: 0 });

    //Socket events
    function connectionEstablished() {
        console.log("Connection established!");
        socket.emit("join room", board);
    };
    
    function roomJoined() {
        console.log("Joined room: " + board);
        setConnected(true);
        dispatch(clearPosts());
        dispatch(fetchBoard(board));
    };

    function pullNewPost({ post }) {
        dispatch(addPost(post));
    };

    //Connecting & Disconnecting
    const handleConnect = () => {
        console.log("Connecting...");
        socket.connect();
        socket.on("connected", connectionEstablished);
        socket.on("room joined", roomJoined);
        socket.on("pull new post", pullNewPost);
    };

    const handleDisconnect = () => {
        console.log("Disconnecting...");
        socket.off("connected", connectionEstablished);
        socket.off("room joined", roomJoined);
        socket.off("pull new post", pullNewPost);
        socket.disconnect();
        setConnected(false);
    };

    //Connect on mount, disconnect on dismount
    useEffect(() => {
        handleConnect();
        return () => handleDisconnect();
    }, [dispatch, board]);

    useEffect(() => {
        setBoard(displayBoard);
        dispatch(setLastBoard(displayBoard));
    }, [displayBoard]);

    useEffect(() => {
        if (!currentUser) {
            setPostFormOpen(false);
        }
    }, [currentUser]);

    let postButton;
    if (currentUser) {
        if (postFormOpen) {
            postButton = (
                // <button onClick={e => setPostFormOpen(false)}>Close Post Form</button>
                <></>
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

    if (!connected) {
        return (
            <p id="connecting-message" className="specific-page-content">
                Connecting...
            </p>
        );
    }
    
    return (
        <div id="form-and-box">
            {postFormOpen &&
            <PostForm setPostFormOpen={setPostFormOpen} setBoard={setBoard} currentBoard={board}/>
            }
            <div id="posts-box">
                <div id="posts-header">
                    <h2>BOARD {board}</h2>
                    <div>
                        <button onClick={scrollToTop}>Back to Top</button>
                        {postButton}
                    </div>
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
        </div>
    );
};

export default Posts;