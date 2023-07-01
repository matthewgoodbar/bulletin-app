import { partialTimestamp } from "../../utils/date";
import profilePic from '../../assets/noimage-64.png'

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
                <div className="post-preview-header"> 
                    <p>Post ID: {post.id}</p>
                    <p>{partialTimestamp(post.createdAt)}</p>
                </div>
                <div className="post-preview-header-m">
                    <span>
                        {userInfo}
                    </span>
                    <div>
                        <p>{partialTimestamp(post.createdAt)}</p>
                        <p>Post ID: {post.id}</p>
                    </div>
                </div>
                <p className="post-title">{post.title}</p>
                <p className="post-body">{post.body}</p>
            </div>
        </li>
    )
};

export default PostPreview;