import React, { useContext, useEffect, useState } from 'react';
import {
  Container,
  Button,
  Card,
  Image,
  Spinner,
  Form,
  Row,
  Col,
  Tabs,
  Tab,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { API_BASE_URL, API_KEY } from '../../common/constants';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bookings, setBookings] = useState([]);
  const [venueBookings, setVenueBookings] = useState([]);
  const [venues, setVenues] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings');


  const navigate = useNavigate();

  const fetchVenueBookings = async (venueIds) => {
    try {
      const allBookings = await Promise.all(
        venueIds.map(async (venueId) => {
          const res = await fetch(`${API_BASE_URL}/holidaze/venues/${venueId}?_bookings=true`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              'X-Noroff-API-Key': API_KEY,
            },
          });
          if (!res.ok) throw new Error('Failed to load venue bookings');
          const data = await res.json();
          return data.data.bookings.map((booking) => ({
            ...booking,
            venue: data.data,
          }));
        })
      );
      return allBookings.flat();
    } catch (err) {
      return [];
    }
  };

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/holidaze/profiles/${user.name}?_bookings=true&_venues=true`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'X-Noroff-API-Key': API_KEY,
          },
        });

        if (!res.ok) throw new Error('Failed to load profile');
        const data = await res.json();
        setProfileData(data);
        setAvatarUrl(data.data.avatar?.url || '');
        setBookings(data.data.bookings || []);
        setVenues(data.data.venues || []);
        const venueBookings = await fetchVenueBookings(data.data.venues.map((v) => v.id));
        setVenueBookings(venueBookings);
      } catch (err) {
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
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'X-Noroff-API-Key': API_KEY,
        },
        body: JSON.stringify({
          avatar: {
            url: avatarUrl,
            alt: `${user.name}'s avatar`,
          },
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProfileData((prev) => ({ ...prev, avatar: updated }));
        alert('✅ Avatar updated successfully!');
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update avatar');
      }
    } catch (err) {
      alert(`❌ Error updating avatar: ${err.message}`);
    }
  };

  const handleDeleteBooking = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/holidaze/bookings/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'X-Noroff-API-Key': API_KEY,
        },
      });

      if (res.ok) {
        setBookings((prev) => prev.filter((booking) => booking.id !== id));
        setVenueBookings((prev) => prev.filter((booking) => booking.id !== id));
        alert('✅ Booking deleted successfully!');
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete booking');
      }
    } catch (err) {
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
            <h3 className='profile-name'>{profileData.data.name}</h3>
            <p><strong>Role:</strong> {profileData.data.venueManager ? 'Venue Manager' : 'Customer'}</p>
          </div>
        </div>

        <Form className="mb-4" onSubmit={(e) => { e.preventDefault(); handleAvatarUpdate(); }}>
          <Form.Group>
            <Form.Label>Update profile picture</Form.Label>
            <Form.Control
              type="url"
              placeholder="Image URL"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
          </Form.Group>
          <div className='d-flex justify-content-end mt-2'>
            <Button type="submit" className="save-picture">Save</Button>
          </div>
        </Form>

        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4 gap-1 profile-tabs">
          <Tab eventKey="bookings" title="My Bookings">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <Card key={booking.id} className="mb-3 d-flex flex-row align-items-center p-3">
                  <Image
                    src={booking.venue?.media?.[0]?.url || 'https://via.placeholder.com/100x100?text=No+Image'}
                    alt={booking.venue?.media?.[0]?.alt || booking.venue?.name}
                    thumbnail
                    width={100}
                    height={100}
                    className="me-3"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="flex-grow-1">
                    <strong className='text-break'>{booking.venue.name}</strong><br />
                    {new Date(booking.dateFrom).toLocaleDateString()} – {new Date(booking.dateTo).toLocaleDateString()}
                    <div className="mt-2">
                      <Button variant="danger" onClick={() => handleDeleteBooking(booking.id)}>Delete</Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <p>You have no upcoming bookings.</p>
            )}
          </Tab>

          {profileData.data.venueManager && (
            <Tab eventKey="venues" title="My Venues">
              <Row>
                <Col md={6}>
                  <h5>My Venues</h5>
                  {venues.length > 0 ? (
                    venues.map((venue) => (
                      <Card key={venue.id} className="mb-3 d-flex flex-row align-items-center p-3">
                        <Image
                          src={venue.media?.[0]?.url || 'https://via.placeholder.com/100x100?text=No+Image'}
                          alt={venue.media?.[0]?.alt || venue.name}
                          thumbnail
                          width={100}
                          height={100}
                          className="me-3"
                          style={{ objectFit: 'cover' }}
                        />
                        <div className="flex-grow-1">
                          <strong>{venue.name}</strong>
                          <div className="mt-2">
                            <Button variant="secondary" onClick={() => navigate(`/venues/edit/${venue.id}`)} className="me-2">
                              Edit
                            </Button>
                            <Button variant="danger" onClick={() => navigate(`/venues/delete/${venue.id}`)}>
                              Delete
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <p>You haven't added any venues yet.</p>
                  )}
                  <Button onClick={() => navigate('/venues/create')} className='create-venue-button my-3'>Create New Venue</Button>
                </Col>

                <Col md={6}>
                  <h5>My Venue Bookings</h5>
                  {venueBookings.length > 0 ? (
                    venueBookings.map((booking) => (
                      <Card key={booking.id} className="mb-3 d-flex flex-row align-items-center p-3">
                        <Image
                          src={booking.venue?.media?.[0]?.url || 'https://via.placeholder.com/100x100?text=No+Image'}
                          alt={booking.venue?.media?.[0]?.alt || booking.venue?.name}
                          thumbnail
                          width={100}
                          height={100}
                          className="me-3"
                          style={{ objectFit: 'cover' }}
                        />
                        <div className="flex-grow-1">
                          <strong>{booking.venue.name}</strong> — {booking.customer?.name}<br />
                          {new Date(booking.dateFrom).toLocaleDateString()} – {new Date(booking.dateTo).toLocaleDateString()}
                        </div>
                      </Card>
                    ))
                  ) : (
                    <p>No bookings available.</p>
                  )}
                </Col>
              </Row>
            </Tab>
          )}
        </Tabs>
      </Card>
    </Container>
  );
};

export default ProfilePage;
