import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { redirect, Link, Navigate } from "react-router-dom";

import { login, clearSessionErrors } from "../../store/session";

const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const errors = useSelector(state => state.errors.session);
    const currentUser = useSelector(state => state.session.currentUser);
    const lastVisited = useSelector(state => state.session.lastVisited);
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearSessionErrors());
        };
    }, [dispatch]);

    const update = (field) => {
        const setField = field === 'username' ? setUsername : setPassword;
        return e => setField(e.currentTarget.value);
    };

    const handleSubmit = e => {
        e.preventDefault();
        dispatch(login({ username, password }));
    };

    const handleLeibniz = e => {
        e.preventDefault();
        dispatch(login({
            username: "leibniz",
            password: "password",
        }));
    };

    const handleNewton = e => {
        e.preventDefault();
        dispatch(login({
            username: "newton",
            password: "password",
        }));
    };

    if (currentUser) {
        return (
            <Navigate to={`/${lastVisited}`} />
        );
    }

    return (
        <div className="specific-page-content session-box">
            <h2 className="session-header-text">LOG IN</h2>
            <form onSubmit={handleSubmit} className="session-form">
                <div>{errors?.username}</div>
                <label> Username: <br />
                    <input type="text" 
                        value={username}
                        onChange={update('username')}
                        placeholder="Username"
                    />
                </label>
                <div>{errors?.password}</div>
                <label> Password: <br />
                    <input type="password"
                        value={password}
                        onChange={update('password')}
                        placeholder="Password"
                    />
                </label>
                <br />
                <input type="submit" 
                    value="Log In"
                    disabled={!username || !password}
                />
            </form>
            <p>Or...</p>
            <div id="demo-logins">
                <button onClick={handleLeibniz}>Login as Leibniz</button>
                <button onClick={handleNewton}>Login as Newton</button>
            </div>
        </div>
    );
};

export default Login;