import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchPost, clearPosts } from "../../store/posts";
import { addOrSlideReply, clearReplies, fetchReplies } from "../../store/replies";
import Connecting from "../Connecting";
import Reply from "../Reply";
import socket from "../../utils/socket";

const FullPost = () => {

    const [connected, setConnected] = useState(false);
    const { postId } = useParams();
    const post = useSelector(state => state.posts[postId]);
    const replies = useSelector(state => {
        let repliesArr = Object.values(state.replies);
        return repliesArr.sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    });
    const dispatch = useDispatch();

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

    if (!connected) {
        return (
            <Connecting />
        );
    }

    return (
        <div id="form-and-box">
            <div id="replies-box">
                <div id="replies-header">
                    <h2>POST FROM: {post && post.author.username}</h2>
                </div>
                <div id="replies-list">
                    <ul>
                        {replies && 
                        replies.map((reply => 
                            <Reply key={reply.id} reply={reply} />
                            ))
                        }
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default FullPost;