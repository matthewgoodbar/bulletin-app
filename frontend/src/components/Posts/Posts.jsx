import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { fetchPosts, addPost, clearPosts, fetchBoard, addOrSlide } from "../../store/posts";
import Connecting from "../Connecting";
import PostPreview from "../PostPreview";
import PostForm from "../PostForm";
import socket from "../../utils/socket";
import boards from "../../utils/boards";
import { setLastVisited } from "../../store/session";

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
        console.log("Joined room: board " + boardId);
        setConnected(true);
        dispatch(clearPosts());
        dispatch(fetchBoard(boardId));
    };

    const pullPost = ({ post }) => {
        dispatch(addOrSlide(post));
    };

    //Connecting & Disconnecting
    const handleConnect = () => {
        console.log("Connecting...");
        socket.connect();
        socket.on("connected", connectionEstablished);
        socket.on("room joined", roomJoined);
        socket.on("pull post", pullPost);
    };

    const handleDisconnect = () => {
        console.log("Disconnecting...");
        socket.off("connected", connectionEstablished);
        socket.off("room joined", roomJoined);
        socket.off("pull post", pullPost);
        socket.disconnect();
        setConnected(false);
    };

    //Connect on mount, disconnect on dismount
    useEffect(() => {
        handleConnect();
        dispatch(setLastVisited(`board/${boardId}`));
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
            postButton = ( <></> );
        } else {
            postButton = ( <button onClick={e => setPostFormOpen(true)}>Create New Post</button> );
        }
    } else {
        postButton = ( <button onClick={e => navigate("/login")}>Create New Post</button> );
    }

    if (!boards.has(boardId)) {
        return (
            <Navigate to="/404" replace />
        )
    }

    if (!connected) {
        return (
            <Connecting />
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
                        posts.map((post) => <PostPreview key={post.id} post={post} /> )
                        }
                        <li className="end-of-feed">
                            <p>End of the line!</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Posts;