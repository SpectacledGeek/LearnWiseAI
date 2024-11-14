

import { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaImage, FaSignInAlt } from 'react-icons/fa';
import { toast, Toaster } from 'sonner';

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '3rem 1.5rem',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    maxWidth: '28rem',
    margin: '0 auto',
    width: '100%',
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '2rem',
    color: '#111827',
  },
  inputGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
  },
  inputWrapper: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    left: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9CA3AF',
  },
  input: {
    width: '100%',
    paddingLeft: '2.5rem',
    paddingRight: '0.75rem',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    borderRadius: '0.375rem',
    border: '1px solid #D1D5DB',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  },
  avatarPreview: {
    width: '3rem',
    height: '3rem',
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  fileInput: {
    display: 'none',
  },
  fileInputLabel: {
    display: 'inline-block',
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#4F46E5',
    backgroundColor: 'white',
    border: '1px solid #E5E7EB',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    marginLeft: '1rem',
  },
  button: {
    width: '100%',
    padding: '0.625rem 1.25rem',
    backgroundColor: '#4F46E5',
    color: 'white',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '1.5rem 0',
  },
  dividerLine: {
    flexGrow: 1,
    height: '1px',
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    padding: '0 0.5rem',
    color: '#6B7280',
    fontSize: '0.875rem',
  },
  loginButton: {
    width: '100%',
    padding: '0.625rem 1.25rem',
    backgroundColor: 'white',
    color: '#4F46E5',
    border: '1px solid #E5E7EB',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default function Signup() {
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
    avatar: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', credentials.name);
    formData.append('email', credentials.email);
    formData.append('password', credentials.password);
    if (credentials.avatar) {
      formData.append('avatar', credentials.avatar);
    }

    try {
      const response = await fetch("http://localhost:5000/api/user/register", {
        method: 'POST',
        body: formData,
      });

      const json = await response.json();

      if (!json.success) {
        toast.error('Registration failed. Please enter valid credentials.');
      } else {
        toast.success('Registration successful!');
        // Optionally, navigate to login page after a short delay
        setTimeout(() => window.location.href = '/login', 2000);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const onChange = (event) => {
    if (event.target.name === 'avatar') {
      setCredentials({ ...credentials, avatar: event.target.files[0] });
    } else {
      setCredentials({ ...credentials, [event.target.name]: event.target.value });
    }
  };

  return (
    <div style={styles.container}>
      <Toaster position="top-center" />
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Create your account</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label htmlFor="name" style={styles.label}>Name</label>
            <div style={styles.inputWrapper}>
              <FaUser style={styles.icon} />
              <input
                type="text"
                id="name"
                name="name"
                style={styles.input}
                placeholder="John Doe"
                value={credentials.name}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email address</label>
            <div style={styles.inputWrapper}>
              <FaEnvelope style={styles.icon} />
              <input
                type="email"
                id="email"
                name="email"
                style={styles.input}
                placeholder="you@example.com"
                value={credentials.email}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <FaLock style={styles.icon} />
              <input
                type="password"
                id="password"
                name="password"
                style={styles.input}
                placeholder="••••••••"
                value={credentials.password}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="avatar" style={styles.label}>Avatar</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={styles.avatarPreview}>
                {credentials.avatar ? (
                  <img
                    src={URL.createObjectURL(credentials.avatar)}
                    alt="Avatar preview"
                    style={styles.avatarImage}
                  />
                ) : (
                  <FaImage size={24} color="#9CA3AF" />
                )}
              </div>
              <label htmlFor="avatar-upload" style={styles.fileInputLabel}>
                Change
              </label>
              <input
                id="avatar-upload"
                name="avatar"
                type="file"
                style={styles.fileInput}
                accept="image/*"
                onChange={onChange}
              />
            </div>
          </div>

          <button type="submit" style={styles.button}>
            Sign up
          </button>
        </form>

        <div style={styles.divider}>
          <div style={styles.dividerLine}></div>
          <span style={styles.dividerText}>Or</span>
          <div style={styles.dividerLine}></div>
        </div>

        <button
          onClick={() => window.location.href = '/login'}
          style={styles.loginButton}
        >
          <FaSignInAlt style={{ marginRight: '0.5rem' }} />
          Log in
        </button>
      </div>
    </div>
  );
}