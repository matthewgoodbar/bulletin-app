import { partialTimestamp } from "../../utils/date";
import profilePic from '../../assets/noimage-64.png'

const PostPreview = ({ post }) => {
    return (
        <li className="single-post">
            <div className="post-preview-profile">
                <img src={profilePic} alt="" />
                <p>{post.author.username}</p>
            </div>
            <div className="post-preview-content">
                <div className="post-preview-header">
                    <p>ID: {post.id}</p>
                    <p>{partialTimestamp(post.createdAt)}</p>
                </div>
                <p className="post-title">{post.title}</p>
                <p className="post-body">{post.body}</p>
            </div>
        </li>
    )
};

export default PostPreview;