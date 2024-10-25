import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const navigate = useNavigate(); // Initialize useNavigate

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        
        // Send login request to the server
        const response = await fetch("http://localhost:5000/api/user/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
            credentials: 'include' // Include cookies in the request
        });

        const json = await response.json(); // Parse the JSON response
        console.log(json); // Log the response for debugging

        if (!response.ok) {
            // Handle errors based on response status
            alert(json.message || 'Enter valid credentials');
        } else {
            // If login is successful
            console.log('Login successful, cookies set.');
            navigate('/'); // Redirect to the home page
        }
    };

    // Function to handle input changes
    const onChange = (event) => {
        setCredentials({ ...credentials, [event.target.name]: event.target.value });
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        id="exampleInputEmail1" 
                        name='email' 
                        value={credentials.email} 
                        onChange={onChange} 
                        placeholder="Enter email" 
                    />
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        id="exampleInputPassword1" 
                        name='password' 
                        value={credentials.password} 
                        onChange={onChange} 
                        placeholder="Password" 
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </>
    );
}

export default Login;
