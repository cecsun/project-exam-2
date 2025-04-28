import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { API_BASE_URL, API_KEY } from '../../common/constants';
import { useNavigate } from 'react-router-dom';

function CreateVenue() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    maxGuests: '',
    images: [], // Array to hold multiple image URLs
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
    setSuccess('');
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData({ ...formData, images: updatedImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImageField = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.description || !formData.price || !formData.maxGuests) {
      setError('All required fields must be filled out.');
      return;
    }

    // Validate minimum values
    if (parseFloat(formData.price) < 0) {
      setError('Price must be at least 0.');
      return;
    }
    if (parseInt(formData.maxGuests, 10) < 1) {
      setError('Max Guests must be at least 1.');
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      maxGuests: parseInt(formData.maxGuests, 10),
      media: formData.images
        .filter((url) => url.trim() !== '') // Filter out empty image fields
        .map((url) => ({ url, alt: `${formData.name} image` })), // Map to media objects
    };

    try {
      const res = await fetch(`${API_BASE_URL}/holidaze/venues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'X-Noroff-API-Key': API_KEY,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccess('Venue created successfully!');
        setTimeout(() => navigate('/profile'), 2000); // Redirect to profile after success
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Failed to create venue.');
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '600px' }}>
      <h2>Create Venue</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Venue Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter venue name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            placeholder="Enter venue description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="price">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            name="price"
            placeholder="Enter price per night"
            value={formData.price}
            onChange={handleChange}
            min="0" // Minimum value for price
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="maxGuests">
          <Form.Label>Max Guests</Form.Label>
          <Form.Control
            type="number"
            name="maxGuests"
            placeholder="Enter maximum number of guests"
            value={formData.maxGuests}
            onChange={handleChange}
            min="1" // Minimum value for maxGuests
            required
          />
        </Form.Group>

        <Form.Label>Images (Optional)</Form.Label>
        {formData.images.map((image, index) => (
          <Form.Group key={index} className="mb-3 d-flex align-items-center">
            <Form.Control
              type="url"
              placeholder={`Enter image URL ${index + 1}`}
              value={image}
              onChange={(e) => handleImageChange(index, e.target.value)}
            />
            <Button
              variant="danger"
              className="ms-2"
              onClick={() => removeImageField(index)}
            >
              Remove
            </Button>
          </Form.Group>
        ))}
        <div></div>
        <Button variant="secondary" onClick={addImageField}>
          Add Image
        </Button>
        <div></div>
        <Button variant="primary" type="submit" className="mt-3">
          Create Venue
        </Button>
      </Form>
    </Container>
  );
}

export default CreateVenue;