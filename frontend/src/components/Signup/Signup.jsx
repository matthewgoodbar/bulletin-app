import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { clearSessionErrors, signup } from "../../store/session";

const Signup = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setpassword2] = useState('');
    const errors = useSelector(state => state.errors.session);
    const currentUser = useSelector(state => state.session.currentUser);
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearSessionErrors());
        }
    }, [dispatch]);

    const update = field => {
        let setField;
        switch (field) {
            case 'username':
                setField = setUsername;
                break;
            case 'password':
                setField = setPassword;
                break;
            case 'password2':
                setField = setpassword2;
                break;
            default:
                throw Error('Unknown field in signup form');
        }
        return e => setField(e.currentTarget.value);
    };

    const handleSubmit = e => {
        e.preventDefault();
        const user = {
            username,
            password
        };
        dispatch(signup(user));
    };

    if (currentUser) {
        return (
            <Navigate to="/" />
        );
    }
    
    return (
        <>
            <h1>SIGN UP</h1>
            <form onSubmit={handleSubmit}>
                <div>{errors?.username}</div>
                <label> Username
                    <input type="text" 
                        value={username}
                        onChange={update('username')}
                        placeholder="Username"
                    />
                </label>
                <div>{errors?.password}</div>
                <label> Password
                    <input type="password"
                        value={password}
                        onChange={update('password')}
                        placeholder="Password"
                    />
                </label>
                <label> Confirm Password
                    <input type="password"
                        value={password2}
                        onChange={update('password2')}
                        placeholder="Confirm Password"
                    />
                </label>
                <input type="submit" 
                    value="Log In"
                    disabled={!username || !password || password !== password2}
                />
            </form>
            <Link to='/'>Back to homepage</Link>
        </>
    );
};

export default Signup;