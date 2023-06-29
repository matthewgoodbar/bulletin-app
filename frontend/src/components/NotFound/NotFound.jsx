import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="specific-page-content not-found">
            <h2 className="session-header-text">404: PAGE NOT FOUND</h2>
            <Link to='/'>Return home</Link>
        </div>
    );
};

export default NotFound;