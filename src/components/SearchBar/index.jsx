import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, ListGroup } from 'react-bootstrap';

function SearchBar({ products, onSearch }) {
  const [query, setQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim().length === 0) {
      setFilteredProducts([]);
      return;
    }

    const lowerQuery = query.toLowerCase();

    const filtered = products.filter((product) => {
      const nameMatch = product.name?.toLowerCase().includes(lowerQuery);
      const cityMatch = product.location?.city?.toLowerCase().includes(lowerQuery);
      const countryMatch = product.location?.country?.toLowerCase().includes(lowerQuery);

      return nameMatch || cityMatch || countryMatch;
    });

    setFilteredProducts(filtered);
  }, [query, products]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <Container className="my-3">
      <Form>
        <Form.Control
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search by name, city, or country..."
        />
      </Form>

      {filteredProducts.length > 0 && (
        <ListGroup className="mt-2">
          {filteredProducts.map((product) => (
            <ListGroup.Item
              key={product.id}
              action
              onClick={() => handleProductClick(product.id)}
            >
              {product.name} – {product.location?.city}, {product.location?.country}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
}

export default SearchBar;
