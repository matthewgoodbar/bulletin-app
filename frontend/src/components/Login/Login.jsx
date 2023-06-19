import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { redirect, Link, Navigate } from "react-router-dom";

import { login, clearSessionErrors } from "../../store/session";

const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const errors = useSelector(state => state.errors.session);
    const currentUser = useSelector(state => state.session.currentUser);
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
        return redirect('/');
    };

    if (currentUser) {
        return (
            <Navigate to='/' />
        );
    }

    return (
        <>
            <h1>LOGIN</h1>
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
                <input type="submit" 
                    value="Log In"
                    disabled={!username || !password}
                />
            </form>
            <Link to='/'>Back to homepage</Link>
        </>
    );
};

export default Login;