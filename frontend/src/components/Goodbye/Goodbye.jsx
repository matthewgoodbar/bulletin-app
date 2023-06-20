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
        <>
            <h1>LOG OUT?</h1>
            <form onSubmit={handleLogout}>
                <input type="submit"
                    value="Yes, log me out"
                />
            </form>
            <p><Link to='/'>No! Take me home.</Link></p>
        </>
    );
};

export default Goodbye;