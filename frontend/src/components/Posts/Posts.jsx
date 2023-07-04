import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { fetchPosts, addPost, clearPosts, fetchBoard, addOrSlide } from "../../store/posts";
import PostPreview from "../PostPreview";
import PostForm from "../PostForm";
import socket from "../../utils/socket";
import boards from "../../utils/boards";
import { setLastBoard } from "../../store/session";

const Posts = () => {

    const posts = useSelector(state => {
        let postsArr = Object.values(state.posts);
        return postsArr.sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    });
    const currentUser = useSelector(state => state.session.currentUser);
    const [connected, setConnected] = useState(false);
    const [postFormOpen, setPostFormOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { boardId } = useParams();
    const scrollRef = useRef(null);

    const scrollToTop = () => scrollRef.current.scrollTo({ top: 0 });

    //Socket events
    const connectionEstablished = () => {
        console.log("Connection established!");
        socket.emit("join room", `board ${boardId}`);
    };
    
    const roomJoined = () => {
        console.log("Joined room: " + boardId);
        setConnected(true);
        dispatch(clearPosts());
        dispatch(fetchBoard(boardId));
    };

    const pullNewPost = ({ post }) => {
        dispatch(addOrSlide(post));
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
        dispatch(setLastBoard(boardId));
        return () => handleDisconnect();
    }, [dispatch, boardId]);

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
            // <p>You must be <Link to="/login">logged in</Link> to post!</p>
            <button onClick={e => navigate("/login")}>Create New Post</button>
        );
    }

    if (!boards.has(boardId)) {
        return (
            <Navigate to="/404" replace />
        )
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
            <PostForm setPostFormOpen={setPostFormOpen} currentBoard={boardId}/>
            }
            <div id="posts-box">
                <div id="posts-header">
                    <h2>BOARD {boardId}</h2>
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