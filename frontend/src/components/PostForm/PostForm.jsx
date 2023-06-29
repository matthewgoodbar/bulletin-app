import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PostForm = () => {

    const currentUser = useSelector(state => state.session.currentUser);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(false);
    }, []);

    const toggleOpen = e => {
        e.preventDefault();
        setOpen(!open);
    }

    if (!currentUser) {
        return (
            <div className="posts-form-closed">
                <p>You must be <Link to="/login">logged in</Link> to post!</p>
            </div>
        );
    }

    return (
        <>
        {open &&
        <div className="posts-form-open">

        </div>
        }
        {!open &&
        <div className="posts-form-closed">
            <button onClick={toggleOpen}>Create a New Post</button>
        </div>
        }
        </>
    );
};

export default PostForm;