import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Navbar = () => {

    const currentUser = useSelector(state => state.session.currentUser);

    let sessionLinks;
    if (currentUser) {
        sessionLinks = (
            <div className="nav-button-group">
                <Link to={`/users/${currentUser.id}`}>Profile</Link>
                <Link to="/goodbye" className="nav-button">Log Out</Link>
            </div>
        );
    } else {
        sessionLinks = (
            <div className="nav-button-group">
                <Link to="/signup" className="nav-button">Sign Up</Link>
                <Link to="/login" className="nav-button">Log In</Link>
            </div>
        );
    }
    
    return (
        <nav id="navbar">
            <div className="nav-button-group">
                <Link to="/" className="nav-button">Home</Link>
                <Link to="/A" className="nav-button">A</Link>
                <Link to="/B" className="nav-button">B</Link>
                <Link to="/C" className="nav-button">C</Link>
                <Link to="/D" className="nav-button">D</Link>
                <Link to="/about" className="nav-button">About</Link>
                <Link to="/rules" className="nav-button">Rules</Link>
            </div>
            {sessionLinks}
        </nav>
    );
};

export default Navbar;