import React from 'react';
import { useCookies } from 'react-cookie'
import './Login.css'
import {useNavigate} from "react-router-dom";

const Login = () => {
    const [_, setCookie] = useCookies(['user'])
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalFormEndpoint = e.target.action;
        const data = Array.from(e.target.elements).filter((input) => input.name).reduce((obj, input) => Object.assign(obj, {[input.name]: input.value}), {})

        fetch(finalFormEndpoint, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (response.status === 200) {
                    setCookie('token', data.token);
                    console.log('Token set: ' + data.token);
                    navigate('/app/table');
                }
            })
    };

    return (
        <div className={"login-page"}>
            <div className="container text-center" style={{width: '100%'}}>
                <main className="form-signin">
                    <form action="https://to29n2obk9.execute-api.us-east-1.amazonaws.com/auth" method="POST" onSubmit={handleSubmit}>
                        <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

                        <div className="form-floating mb-2">
                            <input type="password" className="form-control" name="token" placeholder="AAABBB111"/>
                            <label htmlFor="token">Token</label>
                        </div>

                        <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default Login;
