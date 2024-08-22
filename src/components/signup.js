import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import chatImage from '../asset/chat.png';
import Alert from './alert';

const Signup = (props) => {
    const [node, setnode] = useState({
        name: "",
        email: "",
        password: "",
        confirmpassword: ""
    });
    const navigate= useNavigate();

    const handleChange = (e) => {
        setnode({ ...node, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (node.password !== node.confirmpassword) {
            return props.callalert("Invalid Password", "Passwords do not match");
        }
        if (node.name.length < 4) {
            return props.callalert("Invalid Name", "Name should be at least 3 characters long");
        }

        // API call
        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: node.name,
                    email: node.email,
                    password: node.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                return props.callalert("Error", data.error || "Something went wrong");
            }
            localStorage.setItem('token',data.token);
            props.callalert("Success", "Registration successful");
            navigate('/setavatar');
            // Handle success (e.g., redirect to login page or show success message)
        } catch (error) {
            console.error('Error:', error);
            props.callalert("Error", "Server error, please try again later");
        }
    };

    return (
        <>
            <div className='p-2 text-white' style={{ height: '100vh', background: "#062147" }}>
                <Alert alert={props.alert} />
                <div className="container mt-5" style={{ width: "500px", background: "#2b4261", padding: "20px", borderRadius: "10px" }}>
                    <div className="d-flex flex-row">
                        <img src={chatImage} width="70px" style={{ marginRight: "100px" }} alt="Chat" />
                        <h1 className="mt-2 ml-1 text-primary">Register</h1>
                    </div>
                    <form className='mt-4' onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="exampleInputName" className="form-label">Name</label>
                            <input type="text" className="form-control" onChange={handleChange} name="name" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                            <input type="email" className="form-control" onChange={handleChange} name="email" required id="exampleInputEmail1" aria-describedby="emailHelp" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                            <input type="password" className="form-control" onChange={handleChange} name="password" required id="exampleInputPassword1" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputPassword2" className="form-label">Confirm Password</label>
                            <input type="password" className="form-control" onChange={handleChange} name="confirmpassword" required id="exampleInputPassword2" />
                        </div>
                        <div className="mt-5">
                            <button type="submit" className="btn btn-primary">Signup</button>
                            <span className="px-4 pt-3">Already have an account?<Link to="/login"><b>Login</b></Link></span>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Signup;
