import { useEffect, useState } from 'react';

function Home() {
    const [userName, setUserName] = useState('');
    const [userAvatar, setUserAvatar] = useState(''); // New state for avatar
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/user/current", {
                    method: 'GET',
                    credentials: 'include' // Include credentials for cookie-based authentication
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const json = await response.json();
                if (json.success) {
                    setUserName(json.data.name); // Adjusted based on expected response structure
                    setUserAvatar(json.data.avatar); // Store avatar URL
                } else {
                    setError(json.message || 'Failed to fetch user data');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false); // Set loading to false after the request is done
            }
        };

        fetchUser(); // Call the fetch function
    }, []); // Empty dependency array to run only on component mount

    if (loading) {
        return <p>Loading...</p>; // Show loading message while fetching
    }

    if (error) {
        return <p>{error}</p>; // Show error message if fetching fails
    }

    return (
        <div style={{ textAlign: 'center', margin: '20px' }}>
            {/* Avatar */}
            {userAvatar && (
                <img 
                    src={userAvatar} 
                    alt="User Avatar" 
                    style={{
                        borderRadius: '50%', // Circular shape
                        width: '100px', // Width of the avatar
                        height: '100px', // Height of the avatar
                        objectFit: 'cover', // Cover the area without distortion
                        marginBottom: '10px' // Space between avatar and text
                    }} 
                />
            )}
            <h1>Welcome, {userName}!</h1> {/* Display welcome message with user name */}
        </div>
    );
}

export default Home;
