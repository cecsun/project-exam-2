import React from 'react';
import { Card, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Product({ productDetails }) {
  const { description, price, name, id, media, location } = productDetails;

  return (
    <Link
      to={`/product/${id}`}
      className="text-decoration-none text-dark w-100"
      aria-label={`View details for ${name}`}
    >
      <Card className="mb-4 shadow-sm h-100 rounded-4 hover-shadow card-clickable">
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

        <Card.Body className="d-flex flex-column">
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
            <h5 className="card-price fw-semibold">${price.toFixed(2)}<span className='text-muted fw-light'>/night</span></h5>
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
}


