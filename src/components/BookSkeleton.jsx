import { Card, Placeholder, Row, Col } from 'react-bootstrap';

const BookSkeleton = ({ count = 8 }) => (
  <Row xs={1} sm={2} md={3} lg={4} className="g-4">
    {Array.from({ length: count }).map((_, idx) => (
      <Col key={idx}>
        <Card className="book-card h-100">
          <div className="cover-wrap">
            <Placeholder animation="glow" className="w-50">
              <Placeholder xs={12} style={{ height: '180px', borderRadius: '8px' }} />
            </Placeholder>
          </div>
          <Card.Body>
            <Placeholder animation="glow">
              <Placeholder xs={10} className="mb-2 rounded" />
              <Placeholder xs={6} size="sm" className="mb-4 rounded" />
              <div className="d-flex justify-content-between">
                <Placeholder xs={4} className="rounded" />
                <Placeholder xs={3} className="rounded" />
              </div>
            </Placeholder>
          </Card.Body>
        </Card>
      </Col>
    ))}
  </Row>
);

export default BookSkeleton;
