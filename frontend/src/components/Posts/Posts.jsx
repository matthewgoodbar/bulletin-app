import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../store/posts";

const Posts = () => {

    const posts = useSelector(state => Object.values(state.posts));
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    return (
        <>
            <ul>
                {posts &&
                posts.map((post) => 
                    <li>
                        <ul>
                            <li>{post.id}</li>
                            <li>{post.title}</li>
                            <li>{post.body}</li>
                            <li>{post.createdAt}</li>
                        </ul>
                    </li>
                )}
            </ul>
        </>
    );
};

export default Posts;