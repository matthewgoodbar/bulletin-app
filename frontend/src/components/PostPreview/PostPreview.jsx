import { partialTimestamp } from "../../utils/date";

const PostPreview = ({ post }) => {
    return (
        <li className="single-post">
            <div className="post-header">
                <p>ID: {post.id}</p>
                <p>Posted by: {post.author.username}</p>
                <p>{partialTimestamp(post.createdAt)}</p>
            </div>
            <p className="post-title">{post.title}</p>
            <p className="post-body">{post.body}</p>
        </li>
    )
};

export default PostPreview;