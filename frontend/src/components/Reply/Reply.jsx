import { partialTimestamp } from "../../utils/date";
import profilePic from '../../assets/noimage-64.png'

const Reply = ({ reply }) => {

    const userInfo = (
        <>
            <img 
            className="message-profile-picture"
            src={profilePic} 
            alt={`user ${reply.author.username} profile picture`} 
            />
            <p>{reply.author.username}</p>
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
                    <p>Reply ID: {reply.id}</p>
                </div>
                <p className="message-id">Reply ID: {reply.id}</p>
                <p className="message-body">{reply.body}</p>
                <div className="reply-footer">
                    <p className="message-date">{partialTimestamp(reply.createdAt)}</p>
                </div>
            </div>
        </li>
    )
};

export default Reply;