import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { API_BOOKINGS_URL, API_VENUES_URL, API_KEY } from '../../common/constants';
import { useState, useContext } from 'react';
import {
  Container,
  Row,
  Col,
  Carousel,
  Button,
  Spinner,
  Alert,
  Form,
} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AuthContext from '../../context/AuthContext';

function SingleProductPage() {
  const params = useParams();
  const { data, hasError, isLoading } = useFetch(
    `${API_VENUES_URL}/${params.id}?_bookings=true`
  );

  const navigate = useNavigate();
  const product = data?.data;

  const [selectedDates, setSelectedDates] = useState([null, null]);
  const [guests, setGuests] = useState(1);

  const { isAuthenticated } = useContext(AuthContext);

  const bookedDates =
    product?.bookings
      ?.map((booking) => {
        const startDate = new Date(booking.dateFrom);
        const endDate = new Date(booking.dateTo);
        const dates = [];
        for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
          dates.push(new Date(d));
        }
        return dates;
      })
      .flat() || [];

  const handleDateChange = (dates) => setSelectedDates(dates);

  const handleGuestChange = (e) => {
    const value = Math.min(e.target.value, product.maxGuests);
    setGuests(value);
  };

  const handleBookNowClick = async () => {
    if (selectedDates[0] === null || selectedDates[1] === null) {
      alert('Please select a date range before booking.');
      return;
    }
    try {
      const res = await fetch(`${API_BOOKINGS_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'X-Noroff-API-Key': API_KEY,
        },
        body: JSON.stringify({
          dateFrom: selectedDates[0]?.toISOString(),
          dateTo: selectedDates[1]?.toISOString(),
          guests,
          venueId: product.id,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        alert('Booking created successfully!', data);
        navigate('/profile');
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create booking');
      }
    } catch (err) {
      alert(`Error creating booking: ${err.message}`);
    }
  };

  if (isLoading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Loading product...</p>
      </Container>
    );
  }

  if (hasError) {
    return (
      <Container className="py-5">
        <Alert variant="danger">Error loading product. Please try again later.</Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning">Product not found.</Alert>
      </Container>
    );
  }

  return (
    <Container className="venue-page py-4 mb-5">
      {product.media?.length > 0 && (
        <Row className="mb-4">
          <Col>
            <Carousel>
              {product.media.map((item, index) => (
                <Carousel.Item key={index}>
                  <img
                    src={item.url}
                    alt={item.alt || product.name}
                    className="venue-page-carousel d-block rounded"
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>
      )}

      <Row>
        <Col md={7}>
          <h1 className="text-break">{product.name}</h1>
          <hr />
          <p>{product.description}</p>
          <hr />
          <p className='price'><strong>${product.price.toFixed(2)}</strong><span className='text-muted fw-light'>/night</span></p>
          <hr />
          {product.location && (
            <p className="mb-4">
              <strong>Location:</strong><br />
              {product.location.address}<br />
              {product.location.zip} {product.location.city}<br />
              {product.location.country}
            </p>
          )}

          <hr />
          {product.rating !== 0 && (
            <p className="rating mb-3">
              <strong>Rating: {product.rating} / 5</strong>
            </p>
          )}
          {product.rating === 0 && (
            <p className="rating mb-3">
              Not yet rated
            </p>
          )}
        </Col>

        <Col md={5}>
          <div className="booking-section p-3 border rounded shadow-sm">
            <h2 className="fw-semibold d-flex justify-content-center">Booking</h2>
            <hr />
            <Form>
              <Form.Group controlId="formDate" className="d-flex justify-content-center">
                <DatePicker
                  onChange={handleDateChange}
                  startDate={selectedDates[0]}
                  endDate={selectedDates[1]}
                  selectsRange
                  minDate={new Date()}
                  inline
                  highlightDates={bookedDates}
                  filterDate={(date) =>
                    !bookedDates.some(
                      (bookedDate) => bookedDate.toDateString() === date.toDateString()
                    )
                  }
                  dayClassName={(date) =>
                  bookedDates.some(
                    (bookedDate) => bookedDate.toDateString() === date.toDateString()
                  )
                    ? 'booked-day'
                    : undefined
                }
                />
              </Form.Group>


              <Form.Group controlId="formGuests" className="mt-3">
                <Form.Label>Number of Guests</Form.Label>
                <Form.Control
                  type="number"
                  value={guests}
                  onChange={handleGuestChange}
                  min={1}
                  max={product.maxGuests}
                />
                <Form.Text className="text-muted">Max Guests: {product.maxGuests}</Form.Text>
              </Form.Group>

              {isAuthenticated && (
                <Button onClick={handleBookNowClick} className="button mt-4 w-100">Book Now</Button>
              )}

              {!isAuthenticated && (
                <Alert variant="warning" className="mt-3">Please log in to book this product.</Alert>
              )}
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default SingleProductPage;
