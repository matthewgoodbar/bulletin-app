import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Navbar = () => {

    const currentUser = useSelector(state => state.session.currentUser);
    
    return (
        <nav id="navbar">
            <div className="nav-button-group">
                <Link to="/" className="nav-button">Home</Link>
                <Link to="/about" className="nav-button">About</Link>
                <Link to="/rules" className="nav-button">Rules</Link>
            </div>
            <div className="nav-button-group">
                {!currentUser &&
                <>
                <Link to="/signup" className="nav-button">Sign Up</Link>
                <Link to="/login" className="nav-button">Log In</Link>
                </>
                }
                {currentUser &&
                <>
                <Link to="/goodbye" className="nav-button">Log Out</Link>
                </>
                }
            </div>
        </nav>
    );
};

export default Navbar;