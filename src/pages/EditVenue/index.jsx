import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { API_BASE_URL, API_KEY } from '../../common/constants';

function EditVenue() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    maxGuests: '',
    images: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch venue details
  useEffect(() => {
    async function fetchVenue() {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/holidaze/venues/${id}`);
        if (!res.ok) throw new Error('Failed to fetch venue');
        const data = await res.json();
        const venue = data.data;
        setFormData({
          name: venue.name || '',
          description: venue.description || '',
          price: venue.price || '',
          maxGuests: venue.maxGuests || '',
          images: (venue.media || []).map(img => img.url || ''),
        });
      } catch (err) {
        setError('Could not load venue details.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchVenue();
  }, [id]);

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
    setError('');
    setSuccess('');

    if (!formData.name || !formData.description) {
      setError('Name and description are required.');
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      media: formData.images
        .filter(url => url.trim() !== '')
        .map(url => ({ url, alt: `${formData.name} image` })),
      price: formData.price ? parseFloat(formData.price) : undefined,
      maxGuests: formData.maxGuests ? parseInt(formData.maxGuests, 10) : undefined,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/holidaze/venues/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'X-Noroff-API-Key': API_KEY,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update venue');
      }
      setSuccess('Venue updated successfully!');
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p>Loading venue...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5" style={{ maxWidth: '600px' }}>
      <h1 className='text-center mb-4'>Edit Venue</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Venue Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
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
            value={formData.price}
            onChange={handleChange}
            min="0"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="maxGuests">
          <Form.Label>Max Guests</Form.Label>
          <Form.Control
            type="number"
            name="maxGuests"
            value={formData.maxGuests}
            onChange={handleChange}
            min="1"
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
              tabIndex={-1}
            >
              Remove
            </Button>
          </Form.Group>
        ))}
        <Button variant="secondary" onClick={addImageField} type="button">
          Add Image
        </Button>
        <Button type="submit" className="update-venue-button ms-2 my-3">
          Update Venue
        </Button>
      </Form>
    </Container>
  );
}

export default EditVenue;