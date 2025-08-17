import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'; // ✅ ADDED createUserWithEmail...
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // ✅ ADDED toggle for login/register
  const navigate = useNavigate();

  const handleAuth = async (event) => {
    event.preventDefault();
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password); // ✅ Registration
        alert('Account created successfully!');
        navigate('/');
      } else {
        await signInWithEmailAndPassword(auth, email, password); // ✅ Login
        alert('Logged in successfully!');
        if (email.includes('admin')) {
          navigate('/admin'); // ✅ Redirect admin to dashboard
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      alert((isRegistering ? 'Registration' : 'Login') + ' failed: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto', color: 'white' }}>
      <h2>{isRegistering ? 'Register' : 'Admin / User Login'}</h2>
      <form onSubmit={handleAuth}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem', color: 'black' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem', color: 'black' }}
        />
        <button
          type='submit'
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#1f2937',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          {isRegistering ? 'Register' : 'Login'}
        </button>
      </form>

      {/* ✅ Toggle between Login/Register */}
      <p style={{ marginTop: '1rem' }}>
        {isRegistering ? 'Already have an account?' : 'New user?'}{' '}
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          style={{ color: 'lightblue', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {isRegistering ? 'Login here' : 'Register here'}
        </button>
      </p>
    </div>
  );
};

export default LoginPage;
