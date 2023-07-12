import { partialTimestamp } from "../../utils/date";
import profilePic from '../../assets/noimage-64.png'
import { Link } from "react-router-dom";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { useDispatch, useSelector } from "react-redux";
import { savePost } from "../../store/posts";

const PostPreview = ({ post }) => {

    const postElement = useRef(null);
    const currentUser = useSelector(state => state.session.currentUser);
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        gsap.fromTo(postElement.current, 
            { backgroundColor: 'rgb(219, 163, 146)' }, 
            { backgroundColor: 'rgb(240, 224, 214)', duration: 1 });
    }, [post]);

    const handleSave = e => {
        dispatch(savePost(post.id));
    };

    const userInfo = (
        <>
            <img 
            className="message-profile-picture"
            src={profilePic} 
            alt={`user ${post.author.username} profile picture`} 
            />
            <p>{post.author.username}</p>
        </>
    );

    let saveButton;
    if (!currentUser) {
        saveButton = <></>;
    } else {
        let alreadySaved = post.savedBy.map(ob => ob.id).includes(currentUser.id);
        saveButton = (<button onClick={handleSave} disabled={alreadySaved}>
            {alreadySaved ? "Saved" : "Save"}
        </button>);
    }
    
    return (
        <li className="message-list-element" ref={postElement}>
            <div className="message-profile">
                {userInfo}
            </div>
            <div className="message-content">
                <div className="message-header-m">
                    <span>
                        {userInfo}
                    </span>
                    {saveButton}
                </div>
                <div className="save-button">
                    {saveButton}
                </div>
                <p className="message-title">{post.title}</p>
                <p className="message-body">{post.body}</p>
                <div className="message-footer">
                    <p className="message-date">{partialTimestamp(post.createdAt)}</p>
                    <p>Post ID: {post.id}</p>
                    <Link to={`/post/${post.id}`}>
                        {post._count.replies} {parseInt(post._count.replies) === 1 ? "reply, " : "replies, "}
                        {post.savedBy.length} {post.savedBy.length === 1 ? "save" : "saves"}
                    </Link>
                </div>
            </div>
        </li>
    )
};

export default PostPreview;