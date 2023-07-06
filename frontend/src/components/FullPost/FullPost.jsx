import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchPost, clearPosts } from "../../store/posts";
import { addOrSlideReply, fetchReplies } from "../../store/replies";
import socket from "../../utils/socket";

const FullPost = () => {

    const [connected, setConnected] = useState(false);
    const { postId } = useParams();
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

    return (
        <>
            <p>Hello World</p>
        </>
    );
};

export default FullPost;