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
      className="homepage-card mb-4 shadow-sm h-100 w-100 rounded-4 hover-shadow d-flex flex-column"
      role="button"
      onClick={handleClick}
      aria-label={`View details for ${name}`}
    >
      {media?.length > 0 && (
        <Carousel fade interval={3000} indicators={false}>
          {media.map((item, index) => (
            <Carousel.Item key={index}>
              <img
                src={item.url}
                alt={item.alt || name}
                className="d-block w-100 rounded-top-4"
              />
            </Carousel.Item>
          ))}
        </Carousel>
      )}

      <Card.Body className="d-flex flex-column flex-grow-1">
        <Card.Title as="h1" className="fw-semibold">{name}</Card.Title>

        <Card.Text as="p" className="text-truncate-description">
          {description}
        </Card.Text>

        {location?.city && location?.country && (
          <p className="text-muted">
            {location.city}, {location.country}
          </p>
        )}

        <div className="mt-auto">
          <p className="card-price fw-semibold">
            ${price.toFixed(2)}
            <span className="text-muted fw-light">/night</span>
          </p>
        </div>
      </Card.Body>
    </Card>
  );
}


