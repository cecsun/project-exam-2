import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import Product from '../Product';
import { API_PRODUCTS_URL } from '../../common/constants';
import { useFetch } from '../../hooks/useFetch';
import SearchBar from '../SearchBar';

function ProductsList() {
  const { data, hasError, isLoading } = useFetch(API_PRODUCTS_URL);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (data?.data) {
      setFilteredProducts(data.data);
    }
  }, [data]);

  const handleSearch = (query) => {
    if (!query || query.trim().length === 0) {
      setFilteredProducts(data.data);
      return;
    }

    const lowerQuery = query.toLowerCase();

    const filtered = data.data.filter((product) => {
      const nameMatch = product.name?.toLowerCase().includes(lowerQuery);
      const cityMatch = product.location?.city?.toLowerCase().includes(lowerQuery);
      const countryMatch = product.location?.country?.toLowerCase().includes(lowerQuery);

      return nameMatch || cityMatch || countryMatch;
    });

    setFilteredProducts(filtered);
  };

  if (isLoading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" />
        <p className="mt-3">Loading products...</p>
      </Container>
    );
  }

  if (hasError) {
    return (
      <Container className="py-5">
        <Alert variant="danger">Error loading products. Please try again later.</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <SearchBar products={data?.data || []} onSearch={handleSearch} />
      {filteredProducts.length > 0 ? (
        <Row className="mt-4" xs={1} sm={2} md={3} lg={4} xl={5}>
          {filteredProducts.map((productDetails) => (
            <Col key={productDetails.id} className="mb-4 d-flex">
              <Product productDetails={productDetails} />
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info" className="mt-4">
          No products found
        </Alert>
      )}
    </Container>
  );
}

export default ProductsList;
