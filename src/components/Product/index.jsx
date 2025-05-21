import React from 'react';
import { Card, Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Product({ productDetails }) {
  const { description, price, name, id, media, location } = productDetails;
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (
      e.target.closest('.carousel-control-prev') ||
      e.target.closest('.carousel-control-next')
    ) {
      return;
    }

    navigate(`/product/${id}`);
  };

  return (
    <Card
      className="mb-4 shadow-sm h-100 w-100 rounded-4 hover-shadow d-flex flex-column"
      role="button"
      onClick={handleClick}
      aria-label={`View details for ${name}`}
      style={{ cursor: 'pointer' }}
    >
      {media?.length > 0 && (
        <Carousel fade interval={3000} indicators={false}>
          {media.map((item, index) => (
            <Carousel.Item key={index}>
              <img
                src={item.url}
                alt={item.alt || name}
                className="d-block w-100 rounded-top-4"
                style={{ objectFit: 'cover', height: '200px' }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      )}

      <Card.Body className="d-flex flex-column flex-grow-1">
        <Card.Title className="fw-semibold">{name}</Card.Title>

        <Card.Text className="small text-truncate-description">
          {description}
        </Card.Text>

        {location?.city && location?.country && (
          <div className="text-muted small">
            {location.city}, {location.country}
          </div>
        )}

        <div className="mt-auto">
          <h5 className="card-price fw-semibold">
            ${price.toFixed(2)}
            <span className="text-muted fw-light">/night</span>
          </h5>
        </div>
      </Card.Body>
    </Card>
  );
}


