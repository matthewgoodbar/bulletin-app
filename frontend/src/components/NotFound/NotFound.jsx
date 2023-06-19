import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <>
            <h1>404: PAGE NOT FOUND</h1>
            <p><Link to='/'>Return home</Link></p>
        </>
    );
};

export default NotFound;