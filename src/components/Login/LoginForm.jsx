import React, { useState, useContext } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { API_LOGIN_URL } from '../../common/constants';
import { API_KEY, API_PROFILE_URL } from '../../common/constants';

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isVenueManager = async (user) => {
    try {
      const res = await fetch(`${API_PROFILE_URL}/${user.name}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.accessToken}`,
          'X-Noroff-API-Key': API_KEY,
        },
      });

      if (!res.ok) {
        setError('Failed to fetch profile data');
        return false;
      }
      const profileData = await res.json();
      console.log('Profile data:', profileData);
      if (res.ok) {
        return profileData.data.venueManager;
      } else {
        setError('Failed to fetch profile data');
      }
    } catch (jsonErr) {
      console.error('Error parsing profile data:', jsonErr);
      setError('Failed to parse profile data');
    }

  }

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(API_LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Noroff-API-Key': API_KEY,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.data?.accessToken) {
        // I want to check the return value of the isVenueManager function before logging in
          
        const isManager = await isVenueManager(data.data);
        const enhancedUser = {
          ...data.data,
          venueManager: isManager,
        };
        login(data.data.accessToken, enhancedUser);       
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '500px' }}>
      <h2>Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </Form.Group>

        <Button variant="primary" type="submit">Login</Button>
      </Form>
    </Container>
  );
};

export default LoginForm;
