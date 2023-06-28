import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Navbar = () => {

    const currentUser = useSelector(state => state.session.currentUser);
    
    return (
        <nav id="navbar">
            <Link to="/">Home</Link>
            {!currentUser &&
            <>
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Log In</Link>
            </>
            }
            {currentUser &&
            <Link to="/goodbye">Log Out</Link>
            }
        </nav>
    );
};

export default Navbar;