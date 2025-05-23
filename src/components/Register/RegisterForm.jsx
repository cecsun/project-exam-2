import React, { useState, useContext } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { API_REGISTER_URL, API_LOGIN_URL } from '../../common/constants';
import { API_KEY } from '../../common/constants';
import AuthContext from '../../context/AuthContext';

const RegisterForm = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      venueManager: formData.role === 'venueManager',
    };

    try {
      const registerRes = await fetch(API_REGISTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Noroff-API-Key': API_KEY,
        },
        body: JSON.stringify(payload),
      });

      const registerData = await registerRes.json();

      if (registerRes.status === 400) {
        alert(`${registerData.errors?.[0]?.message || 'Registration failed'}`);
        return;
      }

      if (registerRes.ok) {
        const loginRes = await fetch(API_LOGIN_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': API_KEY,
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const loginData = await loginRes.json();

        if (loginRes.ok) {
          const enhancedUser = {
            ...loginData.data,
            venueManager: formData.role === 'venueManager',
          };
          login(loginData.data.accessToken, enhancedUser);
          navigate('/profile');
        } else {
          setServerResponse('Registered, but login failed. Try logging in manually.');
          navigate('/login');
        }
      } else {
        setServerResponse(`${registerData.message || 'Registration failed'}`);
      }
    } catch (error) {
      setServerResponse(`Network error: ${error.message}`);
    }
  };

  return (
    <Container className="register-form sm bg-light mt-5 border rounded shadow-sm">
      <h1 className="mb-4 d-flex justify-content-center">Register</h1>
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

        <Form.Group className="mb-4" controlId="role">
          <Form.Label>Registering As</Form.Label>
          <Form.Select name="role" value={formData.role} onChange={handleChange}>
            <option value="customer">Customer</option>
            <option value="venueManager">Venue Manager</option>
          </Form.Select>
        </Form.Group>

        <div className="d-flex justify-content-center">
          <Button type="submit" className='register-button my-3'>Register</Button>
        </div>
      </Form>
    </Container>
  );
};

export default RegisterForm;
