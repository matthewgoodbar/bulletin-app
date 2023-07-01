import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createPost, clearPostErrors } from "../../store/posts";

const PostForm = ({ setPostFormOpen }) => {

    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.session.currentUser);
    const errors = useSelector(state => state.errors.posts);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [boardRadio, setBoardRadio] = useState("A");

    useEffect(() => {
        dispatch(clearPostErrors());
    }, [dispatch]);


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

    const handleRadioChange = e => {
        setBoardRadio(e.target.value);
    };

    const handleSubmit = e => {
        e.preventDefault();
        console.log(boardRadio);
        dispatch(createPost({
            title,
            body,
            board: boardRadio,
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
                    <div>
                        <p>Board </p>
                        <label>
                            <input  type="radio" name="board" value="A" 
                            checked={boardRadio === "A"} onChange={handleRadioChange}/>
                            A
                        </label>
                        <label>
                            <input  type="radio" name="board" value="B" 
                            checked={boardRadio === "B"} onChange={handleRadioChange}/>
                            B
                        </label>
                        <label>
                            <input  type="radio" name="board" value="C" 
                            checked={boardRadio === "C"} onChange={handleRadioChange}/>
                            C
                        </label>
                        <label>
                            <input  type="radio" name="board" value="D" 
                            checked={boardRadio === "D"} onChange={handleRadioChange}/>
                            D
                        </label>
                    </div>
                    <div className="post-form-buttons">
                        <input 
                        type="submit" 
                        value="Submit Post"
                        disabled={!currentUser}
                        />
                    </div>
                </div>
            </form>
        </div>
        </>
    );
};

export default PostForm;