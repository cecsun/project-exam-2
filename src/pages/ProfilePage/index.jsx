import React, { useContext, useEffect, useState } from 'react';
import { Container, Button, Card, Image, Spinner, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { API_BASE_URL, API_KEY } from '../../common/constants';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bookings, setBookings] = useState([]);
  const [venues, setVenues] = useState([]);
  const [newBooking, setNewBooking] = useState({ dateFrom: '', dateTo: '', guests: 0, venueId: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/holidaze/profiles/${user.name}?_bookings=true&_venues=true`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'X-Noroff-API-Key': API_KEY,
          },
        });

        if (!res.ok) throw new Error('Failed to load profile');
        const data = await res.json();
        setProfileData(data);
        setAvatarUrl(data.data.avatar?.url || '');
        setBookings(data.data.bookings || []);
        setVenues(data.data.venues || []);
      } catch (err) {
        console.error('Error loading profile:', err);
      }
    };

    fetchProfile();
  }, [user]);

  const handleAvatarUpdate = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/holidaze/profiles/${user.name}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'X-Noroff-API-Key': API_KEY,
        },
        body: JSON.stringify({
          avatar: {
            url: avatarUrl,
            alt: `${user.name}'s avatar`
          },
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProfileData(prev => ({ ...prev, avatar: updated }));
        alert('✅ Avatar updated successfully!');
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update avatar');
      }
    } catch (err) {
      console.error('Avatar update error:', err);
      alert(`❌ Error updating avatar: ${err.message}`);
    }
  };

  // // Handle Booking Creation
  // const handleCreateBooking = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const res = await fetch(`${API_BASE_URL}/holidaze/bookings`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
  //         'X-Noroff-API-Key': API_KEY,
  //       },
  //       body: JSON.stringify(newBooking),
  //     });

  //     if (res.ok) {
  //       const createdBooking = await res.json();
  //       setBookings((prev) => [...prev, createdBooking]);
  //       alert('✅ Booking created successfully!');
  //       setNewBooking({ dateFrom: '', dateTo: '', guests: 0, venueId: '' });
  //     } else {
  //       const errorData = await res.json();
  //       throw new Error(errorData.message || 'Failed to create booking');
  //     }
  //   } catch (err) {
  //     console.error('Error creating booking:', err);
  //     alert(`❌ Error creating booking: ${err.message}`);
  //   }
  // };

  // // Handle Booking Update
  // const handleUpdateBooking = async (id, updatedBooking) => {
  //   try {
  //     const res = await fetch(`${API_BASE_URL}/holidaze/bookings/${id}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
  //         'X-Noroff-API-Key': API_KEY,
  //       },
  //       body: JSON.stringify(updatedBooking),
  //     });

  //     if (res.ok) {
  //       const updated = await res.json();
  //       setBookings((prev) => prev.map((booking) => (booking.id === id ? updated : booking)));
  //       alert('✅ Booking updated successfully!');
  //     } else {
  //       const errorData = await res.json();
  //       throw new Error(errorData.message || 'Failed to update booking');
  //     }
  //   } catch (err) {
  //     console.error('Error updating booking:', err);
  //     alert(`❌ Error updating booking: ${err.message}`);
  //   }
  // };

  // Handle Booking De/letion
  const handleDeleteBooking = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/holidaze/bookings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'X-Noroff-API-Key': API_KEY,
        },
      });

      if (res.ok) {
        setBookings((prev) => prev.filter((booking) => booking.id !== id));
        alert('✅ Booking deleted successfully!');
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete booking');
      }
    } catch (err) {
      console.error('Error deleting booking:', err);
      alert(`❌ Error deleting booking: ${err.message}`);
    }
  };

  if (!profileData) {
    return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  }

  return (
    <Container className="mt-5">
      <Card className="p-4">
        <div className="d-flex align-items-center gap-4 mb-4">
          <Image
            src={profileData.data.avatar?.url || 'https://via.placeholder.com/150'}
            roundedCircle
            width="100"
            height="100"
          />
          <div>
            <h3>{profileData.data.name}</h3>
            <p><strong>Role:</strong> {profileData.data.venueManager ? 'Venue Manager' : 'Customer'}</p>
          </div>
        </div>

        <Form className="mb-4" onSubmit={e => { e.preventDefault(); handleAvatarUpdate(); }}>
          <Form.Group>
            <Form.Label>Update Avatar URL</Form.Label>
            <Form.Control
              type="url"
              placeholder="Enter new avatar image URL"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-2">Save Avatar</Button>
        </Form>

        {/* {!profileData.data.venueManager && ( */}
          {/* <> */}

          {/* </> */}
        {/* )} */}

        {profileData.data.venueManager && (
          <>
            <h4>Your Venues</h4>
            {venues.length > 0 ? (
              venues.map(venue => (
                <Card key={venue.id} className="mb-3 p-3">
                  <strong>{venue.name}</strong>
                  <div className="mt-2">
                    <Button
                      variant="secondary"
                      onClick={() => navigate(`/venues/edit/${venue.id}`)}
                      className="me-2"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => navigate(`/venues/delete/${venue.id}`)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <p>You haven't added any venues yet.</p>
            )}
            <Button onClick={() => navigate('/venues/create')}>Create New Venue</Button>
            {/* <h4 className="mt-4">Manage Bookings</h4> */}
            {/* <Form onSubmit={handleCreateBooking}>
              <Form.Group>
                <Form.Label>Venue</Form.Label>
                <Form.Control
                  as="select"
                  value={newBooking.venueId}
                  onChange={(e) => setNewBooking({ ...newBooking, venueId: e.target.value })}
                >
                  <option value="">Select Venue</option>
                  {venues.map((venue) => (
                    <option key={venue.id} value={venue.id}>{venue.name}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={newBooking.dateFrom}
                  onChange={(e) => setNewBooking({ ...newBooking, dateFrom: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={newBooking.dateTo}
                  onChange={(e) => setNewBooking({ ...newBooking, dateTo: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Guests</Form.Label>
                <Form.Control
                  type="number"
                  value={newBooking.guests}
                  onChange={(e) => setNewBooking({ ...newBooking, guests: parseInt(e.target.value) })}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="mt-2">Create Booking</Button>
            </Form> */}

            <h4 className="mt-4">Existing Bookings</h4>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <Card key={booking.id} className="mb-3 p-3">
                  <strong>{booking.venue.name}</strong> – {new Date(booking.dateFrom).toLocaleDateString()}
                  <div className="mt-2">
                    {/* <Button
                      variant="secondary"
                      onClick={() => handleUpdateBooking(booking.id, { dateFrom: newBooking.dateFrom, dateTo: newBooking.dateTo, guests: newBooking.guests })}
                      className="me-2"
                    >
                      Edit
                    </Button> */}
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteBooking(booking.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <p>No bookings available.</p>
            )}
          </>
          
        )}
        <h4>Your Bookings</h4>
        {bookings.length > 0 ? (
          bookings.map(booking => (
            <Card key={booking.id} className="mb-2 p-3">
              <strong>{booking.venue.name}</strong> {new Date(booking.dateFrom).toLocaleDateString()} - {new Date(booking.dateTo).toLocaleDateString()}
            </Card>
          ))
        ) : (
          <p>You have no upcoming bookings.</p>
        )}
      </Card>
    </Container>
  );
};

export default ProfilePage;
