import React from 'react';
import { Card, Button, Badge, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Product({ productDetails }) {
  const { description, discountedPrice, price, name, id, media, location } = productDetails;

  const discountPercentage = ((price - discountedPrice) / price) * 100;

  return (
    <Card className="mb-4 shadow-sm h-100">
      {media?.length > 0 && (
        <Carousel fade interval={3000}>
          {media.map((item, index) => (
            <Carousel.Item key={index}>
              <img
                src={item.url}
                alt={item.alt || name}
                className="d-block w-100"
                style={{ objectFit: 'cover', height: '200px' }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      )}
      <Card.Body className="d-flex flex-column">
        <Card.Title>{name}</Card.Title>
        <Card.Text>{description}</Card.Text>

        {/* 📍 Location */}
        {location?.city && location?.country && (
          <div className="text-muted mb-2 d-flex align-items-center gap-1">
            <span role="img" aria-label="location">📍</span>
            <small>{location.city}, {location.country}</small>
          </div>
        )}

        <div className="mb-2">
          {discountedPrice < price ? (
            <>
              <h5 className="text-success">${discountedPrice.toFixed(2)}</h5>
              <Badge bg="danger" className="mb-1">
                {discountPercentage.toFixed(2)}% off
              </Badge>
              <div className="text-muted text-decoration-line-through">${price.toFixed(2)}</div>
            </>
          ) : (
            <h5>${price.toFixed(2)}</h5>
          )}
        </div>

        <div className="mt-auto">
          <Link to={`/product/${id}`} className="d-block mb-2">
            <Button variant="outline-primary" className="w-100">
              View Product
            </Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
}
