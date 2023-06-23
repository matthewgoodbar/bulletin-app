import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const HomePage = () => {

    const currentUser = useSelector(state => state.session.currentUser);
    const dispatch = useDispatch();

    let greeting;
    if (currentUser) {
        greeting = (
            <>
                <p>Welcome, {currentUser?.username}!</p>
                <p><Link to='/goodbye'>Log Out</Link></p>
            </>
        );
    } else {
        greeting = (
            <>
                <p>You are not logged in!</p>
                <p><Link to='/login'>Log In</Link> or <Link to='/signup'>Sign Up</Link></p>
            </>
        );
    }
    
    return (
        <>
            <h1>THIS IS MY HOMEPAGE</h1>
            {greeting}
            <p><Link to="/posts">View Posts</Link></p>
        </>
    );
};

export default HomePage;