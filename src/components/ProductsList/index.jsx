import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import Product from '../Product';
import { API_BASE_URL } from '../../common/constants';
import SearchBar from '../SearchBar';

function ProductsList() {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const fetchVenues = async (query = '') => {
    setIsLoading(true);
    setHasError(false);
    try {
      let url = `${API_BASE_URL}/holidaze/venues`;
      if (query.trim()) {
        url = `${API_BASE_URL}/holidaze/venues/search?q=${encodeURIComponent(query)}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch venues');
      const data = await res.json();
      setFilteredProducts(data.data || []);
    } catch (err) {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const handleSearch = (query) => {
    fetchVenues(query);
  };

return (
  <>
    <Container className="py-4">
      <div className="mb-4">
        <SearchBar onSearch={handleSearch} />
      </div>

      {isLoading && (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
          <p className="mt-3">Loading venues...</p>
        </div>
      )}

      {hasError && (
        <Alert variant="danger" className="mt-4">
          Error loading venues. Please try again later.
        </Alert>
      )}

      {!isLoading && !hasError && (
        filteredProducts.length > 0 ? (
          <Row className="mt-4" xs={1} sm={2} md={3} lg={4}>
            {filteredProducts.map((productDetails) => (
              <Col key={productDetails.id} className="mb-4 d-flex">
                <Product productDetails={productDetails} />
              </Col>
            ))}
          </Row>
        ) : (
          <Alert variant="info" className="mt-4">
            No venues found
          </Alert>
        )
      )}
    </Container>
  </>
);

}

export default ProductsList;
