import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { createPost, clearPostErrors, bumpPost } from "../../store/posts";
import { clearReplyErrors, createReply } from "../../store/replies";

const PostForm = ({ setPostFormOpen, currentBoard, originalPost }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector(state => state.session.currentUser);
    const errors = useSelector(state => state.errors.posts);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [boardRadio, setBoardRadio] = useState(currentBoard);

    useEffect(() => {
        if (originalPost) {
            dispatch(clearReplyErrors());
        } else {
            dispatch(clearPostErrors());
        }
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

    const submitPost = e => {
        e.preventDefault();
        if (currentUser) {
            dispatch(createPost({
                title,
                body,
                board: boardRadio,
            }));
            setTitle("");
            setBody("");
            if (boardRadio != currentBoard) {
                navigate(`/board/${boardRadio}`);
            }
        } else {
            navigate("/login");
        }
    };

    const submitReply = e => {
        e.preventDefault();
        if (currentUser) {
            dispatch(createReply({
                postId: originalPost.id,
                body,
            }))
                .then(() => {
                    dispatch(bumpPost(originalPost.id));
                });
            setBody("");
        } else {
            navigate("/login");
        }
    }

    const radioChunk = (
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
    );

    const titleChunk = (
        <label> Title {errors?.title}<br />
            <input 
            type="text" 
            placeholder="Subject of the post"
            value={title}
            onChange={updateField("title")}
            />
        </label>
    );

    return (
        <>
        <div className="post-form-open">
            <div className="post-form-info">
                <h2>{originalPost ? "New Reply" : "New Post"}</h2>
                <p>Please read the rules before posting!</p>
            </div>
            <form onSubmit={originalPost ? submitReply : submitPost} className="post-form">
                <button className="close-form-x" onClick={closeForm}>X</button>
                <h2>{originalPost ? "NEW REPLY" : "NEW POST"}</h2>
                <div className="post-form-input-boxes">
                    {!originalPost &&
                    titleChunk
                    }
                    <label> Body {errors?.body}<br />
                        <textarea 
                        cols="48" 
                        rows="4"
                        value={body}
                        onChange={updateField("body")}
                        ></textarea>
                    </label>
                    {!originalPost && 
                    radioChunk
                    }
                    <div className="post-form-buttons">
                        <input 
                        type="submit" 
                        value={originalPost ? "Submit Reply" : "Submit Post"}
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