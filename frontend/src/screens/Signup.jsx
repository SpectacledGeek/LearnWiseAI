import React, { useState } from 'react';

function Signup() {
    const [credentials, setCredentials] = useState({
        name: '',
        email: '',
        password: '',
        avatar: null // To hold the uploaded file
    });

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        
        const formData = new FormData(); // Create a FormData object to handle file uploads
        formData.append('name', credentials.name);
        formData.append('email', credentials.email);
        formData.append('password', credentials.password);
        if (credentials.avatar) {
            formData.append('avatar', credentials.avatar); // Append the avatar file if it exists
        }

        const response = await fetch("http://localhost:5000/api/user/register", {
            method: 'POST',
            body: formData, // Send the FormData object
        });

        const json = await response.json();
        console.log(json);

        if (!json.success) {
            alert('Enter valid credentials');
        } else {
            alert('Registration successful!'); // Notify successful registration
            // Optionally, you could navigate to the login page or home page here
        }
    };

    // Handle input changes
    const onChange = (event) => {
        if (event.target.name === 'avatar') {
            setCredentials({ ...credentials, avatar: event.target.files[0] }); // Handle file upload
        } else {
            setCredentials({ ...credentials, [event.target.name]: event.target.value });
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}> {/* Form submission handler */}
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input 
                        type="text" 
                        className="form-control"  
                        name='name' 
                        value={credentials.name} 
                        onChange={onChange} 
                        placeholder="Enter name" 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        id="exampleInputEmail1" 
                        name='email' 
                        value={credentials.email} 
                        aria-describedby="emailHelp" 
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
                <div className="form-group">
                    <label htmlFor="avatar">Avatar</label>
                    <input 
                        type="file" 
                        className="form-control" 
                        id="avatar" 
                        name='avatar' 
                        onChange={onChange} 
                        accept="image/*" // Allow only image uploads
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button> {/* Submit button */}
            </form>
        </>
    );
}

export default Signup;
