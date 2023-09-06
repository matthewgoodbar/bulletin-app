import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { clearPosts, fetchUserPosts, addOrSlide } from "../../store/posts";
import { clearUsers, fetchUser } from "../../store/users";
import { setLastVisited } from "../../store/session";
import socket from "../../utils/socket";
import Connecting from "../Connecting";
import PostForm from "../PostForm";
import PostPreview from "../PostPreview";

const User = () => {

    const posts = useSelector(state => {
        let postsArr = Object.values(state.posts);
        return postsArr.sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    });
    const dispatch = useDispatch();
    const { userId } = useParams();
    const currentUser = useSelector(state => state.session.currentUser);
    const [postFormOpen, setPostFormOpen] = useState(false);
    const [connected, setConnected] = useState(false);
    const user = useSelector(state => state.users[userId]);
    const scrollRef = useRef(null);
    const navigate = useNavigate();

    const scrollToTop = () => scrollRef.current.scrollTo({ top: 0 });

    //Socket events
    const connectionEstablished = () => {
        console.log("Connection established!");
        socket.emit("join room", `user ${userId}`);
    };
    
    const roomJoined = () => {
        console.log("Joined room: user " + userId);
        setConnected(true);
        dispatch(clearPosts());
        dispatch(clearUsers());
        dispatch(fetchUser(userId));
        dispatch(fetchUserPosts(userId));
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
        dispatch(setLastVisited(`user/${userId}`));
        return () => handleDisconnect();
    }, [dispatch, userId]);

    // useEffect(() => {
    //     dispatch(clearPosts());
    //     dispatch(clearUsers());
    //     dispatch(fetchUser(userId));
    // }, [dispatch, userId]);

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

    let userBio;
    userBio = (
        <li id="user-bio" className="message-list-element" key={0}>

        </li>
    );

    if (!connected || !user) {
        return (
            <Connecting />
        );
    }

    return (
        <div id="form-and-box">
            {postFormOpen &&
            <PostForm setPostFormOpen={setPostFormOpen} currentBoard={undefined}/>
            }
            <div id="user-box">
                <div id="user-header">
                    <h2>USER: {user.username}</h2>
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

export default User;