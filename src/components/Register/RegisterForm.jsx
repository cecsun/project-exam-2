import React, { useState, useContext } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { API_REGISTER_URL, API_LOGIN_URL } from '../../common/constants';
import AuthContext from '../../context/AuthContext';

const RegisterForm = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [serverResponse, setServerResponse] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    const emailPattern = /^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/;
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Email must be a valid stud.noroff.no address';
    }
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
    setServerResponse('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Step 1: Register the user
      const registerRes = await fetch(API_REGISTER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const registerData = await registerRes.json();

      if (registerRes.status === 400) {
        alert(`❌ ${registerData.errors?.[0]?.message || 'Registration failed'}`);
        return;
      }

      if (registerRes.ok) {
        // Step 2: Immediately log them in using login API
        const loginRes = await fetch(API_LOGIN_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const loginData = await loginRes.json();

        if (loginRes.ok) {
          // Step 3: Save via context and redirect
          login(loginData.data.accessToken, loginData.data);
          navigate('/dashboard');
        } else {
          setServerResponse('⚠️ Registered, but login failed. Please try logging in manually.');
          navigate('/login');
        }
      } else {
        setServerResponse(`❌ ${registerData.message || 'Registration failed'}`);
      }
    } catch (error) {
      setServerResponse(`🚨 Network error: ${error.message}`);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4">Register</h2>
      {serverResponse && <Alert variant="danger">{serverResponse}</Alert>}
      <Form onSubmit={handleSubmit} noValidate>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            isInvalid={!!errors.name}
          />
          <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email (stud.noroff.no)</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="yourname@stud.noroff.no"
            value={formData.email}
            onChange={handleChange}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password (min 8 characters)</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            isInvalid={!!errors.password}
          />
          <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit">Register</Button>
      </Form>
    </Container>
  );
};

export default RegisterForm;
