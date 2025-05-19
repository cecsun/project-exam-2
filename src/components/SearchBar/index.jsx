import React from 'react';
import { Form, Container } from 'react-bootstrap';

function SearchBar({ onSearch }) {
  const handleInputChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <Container className="my-3">
      <Form>
        <Form.Control
          type="text"
          onChange={handleInputChange}
          placeholder="Search by name, city or country..."
          className="search-input"
        />
      </Form>
    </Container>
  );
}

export default SearchBar;
