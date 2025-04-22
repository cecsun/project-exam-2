import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { API_SINGLE_PRODUCT_URL } from '../../common/constants';
import { useState, useContext } from 'react';
import {
  Container,
  Row,
  Col,
  Carousel,
  Button,
  Spinner,
  Alert,
  Badge,
  Form,
} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { subDays, addDays } from 'date-fns';
import AuthContext from '../../context/AuthContext';

function SingleProductPage() {
  const params = useParams();
  const { data, hasError, isLoading } = useFetch(
    `${API_SINGLE_PRODUCT_URL}/${params.id}`
  );

  const navigate = useNavigate();

  const product = data?.data;
  const discountPercentage =
    product && product.discountedPrice < product.price
      ? ((product.price - product.discountedPrice) / product.price) * 100
      : 0;

  const [selectedDates, setSelectedDates] = useState([null, null]);
  const [guests, setGuests] = useState(1);

  const { isAuthenticated } = useContext(AuthContext); // Get user from AuthContext
  // Simulated booked dates
  const bookedDates = [
    subDays(new Date(), 1),
    addDays(new Date(), 2),
    addDays(new Date(), 5),
  ];

  const handleDateChange = (dates) => {
    setSelectedDates(dates);
  };

  const handleGuestChange = (e) => {
    const value = Math.min(e.target.value, product.maxGuests);
    setGuests(value);
  };

  const handleBookNowClick = () => {
    navigate('/profile');
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
    <Container className="py-4">
      <Row>
        <Col md={6}>
          {product.media?.length > 0 && (
            <Carousel>
              {product.media.map((item, index) => (
                <Carousel.Item key={index}>
                  <img
                    src={item.url}
                    alt={item.alt || product.name}
                    className="d-block w-100"
                    style={{ maxHeight: '400px', objectFit: 'cover' }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          )}
        </Col>

        <Col md={6}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>

          {product.discountedPrice < product.price ? (
            <>
              <h4 className="text-success">${product.discountedPrice.toFixed(2)}</h4>
              <Badge bg="danger" className="mb-2">
                {discountPercentage.toFixed(2)}% off
              </Badge>
              <div className="text-muted text-decoration-line-through">
                ${product.price.toFixed(2)}
              </div>
            </>
          ) : (
            <h4>${product.price.toFixed(2)}</h4>
          )}

          {product.location && (
            <div className="mt-3 text-muted small">
              <strong>Location:</strong>
              <div>{product.location.address}</div>
              <div>
                {product.location.zip} {product.location.city}
              </div>
              <div>{product.location.country}</div>
            </div>
          )}

          {/* Check Availability Section */}
          <div className="mt-4">
            <h5>Check Availability</h5>
            <Form>
              <Form.Group controlId="formDate">
                <Form.Label>Select a Date Range</Form.Label>
                <DatePicker
                  selected={selectedDates[0]}
                  onChange={handleDateChange}
                  startDate={selectedDates[0]}
                  endDate={selectedDates[1]}
                  selectsRange
                  minDate={new Date()}
                  dateFormat="MMMM d, yyyy"
                  className="form-control"
                  highlightDates={bookedDates}
                  filterDate={(date) =>
                    !bookedDates.some(
                      (bookedDate) =>
                        bookedDate.toDateString() === date.toDateString()
                    )
                  }
                  shouldCloseOnSelect={false}
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
                <Form.Text className="text-muted">
                  Max Guests: {product.maxGuests}
                </Form.Text>
              </Form.Group>

              <Button variant="primary" className="mt-3">
                Check Availability
              </Button>
            </Form>
          </div>

          {product.rating && (
            <div className="mt-4">
              <h5>Rating: {product.rating}/5</h5>
            </div>
          )}

          {isAuthenticated && (
          <Button onClick={handleBookNowClick} variant="success" className="mt-3">
            Book Now
          </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default SingleProductPage;
