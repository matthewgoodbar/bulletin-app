import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createPost, clearPostErrors } from "../../store/posts";

const PostForm = ({ setPostFormOpen }) => {

    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.session.currentUser);
    const errors = useSelector(state => state.errors.posts);
    // const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    useEffect(() => {
        // setOpen(false);
        dispatch(clearPostErrors());
    }, [dispatch]);

    // const openForm = e => {
    //     setOpen(true);
    // };

    const closeForm = e => {
        setPostFormOpen(false);
    };

    const updateField = field => {
        let setField;
        switch (field) {
            case "title":
                setField = setTitle;
                break;
            case "body":
                setField = setBody;
                break;
            default:
                throw Error("unknown field in post form");
        }
        return e => setField(e.target.value);
    };

    const handleSubmit = e => {
        e.preventDefault();
        dispatch(createPost({
            authorId: currentUser.id,
            title,
            body,
        }));
        setTitle("");
        setBody("");
    };

    if (!currentUser) {
        return (
            <div className="post-form-closed">
                <p>You must be <Link to="/login">logged in</Link> to post!</p>
            </div>
        );
    }

    return (
        <>
        <div className="post-form-open">
            <div className="post-form-info">
                <h2>New Post {'>>'}</h2>
                <p>Please read the rules before posting!</p>
            </div>
            <form onSubmit={handleSubmit} className="post-form">
                <button className="close-form-x" onClick={closeForm}>X</button>
                <h2>NEW POST</h2>
                <div className="post-form-input-boxes">
                    <label> Title {errors?.title}<br />
                        <input 
                        type="text" 
                        placeholder="Subject of the post"
                        value={title}
                        onChange={updateField("title")}
                        />
                    </label>
                    <label> Body {errors?.body}<br />
                        <textarea 
                        cols="48" 
                        rows="4"
                        value={body}
                        onChange={updateField("body")}
                        ></textarea>
                    </label>
                </div>
                <div className="post-form-buttons">
                    <input 
                    type="submit" 
                    value="Submit Post"
                    disabled={!currentUser}
                    />
                </div>
            </form>
        </div>
        </>
    );
};

export default PostForm;