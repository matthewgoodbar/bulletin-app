import { partialTimestamp } from "../../utils/date";
import profilePic from '../../assets/noimage-64.png'
import { Link } from "react-router-dom";

const PostPreview = ({ post }) => {

    const userInfo = (
        <>
            <img 
            className="post-preview-profile-picture"
            src={profilePic} 
            alt={`user ${post.author.username} profile picture`} 
            />
            <p>{post.author.username}</p>
        </>
    );
    
    return (
        <li className="single-post">
            <div className="post-preview-profile">
                {userInfo}
            </div>
            <div className="post-preview-content">
                <div className="post-preview-header-m">
                    <span>
                        {userInfo}
                    </span>
                    <p>Post ID: {post.id}</p>
                </div>
                <p className="post-id">Post ID: {post.id}</p>
                <p className="post-title">{post.title}</p>
                <p className="post-body">{post.body}</p>
                <div className="post-preview-footer">
                    <Link to={`/post/${post.id}`}>
                        {post._count.replies} {parseInt(post._count.replies) === 1 ? "reply" : "replies"}
                    </Link>
                    <p className="post-date">{partialTimestamp(post.createdAt)}</p>
                </div>
            </div>
        </li>
    )
};

export default PostPreview;