import { partialTimestamp } from "../../utils/date";
import profilePic from '../../assets/noimage-64.png'
import { Link } from "react-router-dom";

const PostPreview = ({ post }) => {

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
    
    return (
        <li className="message-list-element">
            <div className="message-profile">
                {userInfo}
            </div>
            <div className="message-content">
                <div className="message-header-m">
                    <span>
                        {userInfo}
                    </span>
                    <p>Post ID: {post.id}</p>
                </div>
                <p className="message-id">Post ID: {post.id}</p>
                <p className="message-title">{post.title}</p>
                <p className="message-body">{post.body}</p>
                <div className="message-footer">
                    <Link to={`/post/${post.id}`}>
                        {post._count.replies} {parseInt(post._count.replies) === 1 ? "reply" : "replies"}
                    </Link>
                    <p className="message-date">{partialTimestamp(post.createdAt)}</p>
                </div>
            </div>
        </li>
    )
};

export default PostPreview;