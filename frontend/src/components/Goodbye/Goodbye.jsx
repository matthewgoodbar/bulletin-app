import { useDispatch, useSelector } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import { logout } from "../../store/session";


const Goodbye = () => {

    const currentUser = useSelector(state => state.session.currentUser);
    const dispatch = useDispatch();

    const handleLogout = e => {
        e.preventDefault();
        dispatch(logout());
    };

    if (!currentUser) {
        return (
            <Navigate to='/' />
        );
    }
    
    return (
        <div className="specific-page-content session-box">
            <h2 className="session-header-text">LOG OUT?</h2>
            <button onClick={handleLogout}>Yes, log me out.</button>
            <Link to="/">No! Take me home!</Link>
        </div>
    );
};

export default Goodbye;