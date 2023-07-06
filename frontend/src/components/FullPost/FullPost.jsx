import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPost, clearPosts } from "../../store/posts";
import { addOrSlideReply, clearReplies, fetchReplies } from "../../store/replies";
import profilePic from '../../assets/noimage-64.png'
import Connecting from "../Connecting";
import Reply from "../Reply";
import PostForm from "../PostForm";
import socket from "../../utils/socket";
import { partialTimestamp } from "../../utils/date";

const FullPost = () => {

    const [connected, setConnected] = useState(false);
    const [postFormOpen, setPostFormOpen] = useState(false);
    const { postId } = useParams();
    const currentUser = useSelector(state => state.session.currentUser);
    const post = useSelector(state => state.posts[postId]);
    const replies = useSelector(state => {
        let repliesArr = Object.values(state.replies);
        return repliesArr.sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const scrollRef = useRef(null);

    const scrollToTop = () => scrollRef.current.scrollTo({ top: 0 });

    //Socket events
    const connectionEstablished = () => {
        console.log("Connection established!");
        socket.emit("join room", `post ${postId}`);
    };
    
    const roomJoined = () => {
        console.log("Joined room: post " + postId);
        setConnected(true);
        dispatch(clearPosts());
        dispatch(clearReplies());
        dispatch(fetchPost(postId));
        dispatch(fetchReplies(postId));
    };

    const pullReply = ({ reply }) => {
        dispatch(addOrSlideReply(reply));
    };

    //Connecting & Disconnecting
    const handleConnect = () => {
        console.log("Connecting...");
        socket.connect();
        socket.on("connected", connectionEstablished);
        socket.on("room joined", roomJoined);
        socket.on("pull reply", pullReply);
    };

    const handleDisconnect = () => {
        console.log("Disconnecting...");
        socket.off("connected", connectionEstablished);
        socket.off("room joined", roomJoined);
        socket.off("pull reply", pullReply);
        socket.disconnect();
        setConnected(false);
    };

    useEffect(() => {
        handleConnect();
        return () => handleDisconnect();
    }, [dispatch, postId]);

    if (!connected || !post) {
        return (
            <Connecting />
        );
    }

    let postButton;
    if (currentUser) {
        if (postFormOpen) {
            postButton = ( <></> );
        } else {
            postButton = ( <button onClick={e => setPostFormOpen(true)}>Reply</button> );
        }
    } else {
        postButton = ( <button onClick={e => navigate("/login")}>Reply</button> );
    }

    const opInfo = (
        <>
            <img 
            className="message-profile-picture"
            src={profilePic} 
            alt={`user ${post.author.username} profile picture`} 
            />
            <p>{post.author.username}</p>
        </>
    );

    const op = (
        <li id="original-post" className="message-list-element" key={0} >
            <div className="message-profile">
                {opInfo}
            </div>
            <div className="message-content">
                <div className="message-header-m">
                    <span>
                        {opInfo}
                    </span>
                    <p>Post ID: {post.id}</p>
                </div>
                <p className="message-id">Post ID: {post.id}</p>
                <p className="message-body">{post.body}</p>
                <div className="op-footer">
                    <p className="message-date">{partialTimestamp(post.createdAt)}</p>
                </div>
            </div>
        </li>
    );

    return (
        <div id="form-and-box">
            <div id="replies-box">
                <div id="replies-header">
                    <h2>{post && post.title}</h2>
                    <div>
                        <button onClick={scrollToTop}>Back to Top</button>
                        {postButton}
                    </div>
                </div>
                <div id="replies-list" ref={scrollRef}>
                    <ul>
                        {op}
                        <li className="post-replies-divider">
                            <p>All Replies</p>
                        </li>
                        {replies && 
                        replies.map(reply => <Reply key={reply.id} reply={reply} /> )
                        }
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default FullPost;