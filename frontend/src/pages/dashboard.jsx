import React from "react";
import { Card, Row, Col } from "react-bootstrap";

const Dashboard = () => {
  return (
    <div>
      <h2>Dashboard</h2>
      <Row>
        <Col md={4}>
          <Card className="p-3 shadow-sm">
            <Card.Body>
              <h5>Total Attacks</h5>
              <h2>150</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="p-3 shadow-sm">
            <Card.Body>
              <h5>Blocked IPs</h5>
              <h2>75</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="p-3 shadow-sm">
            <Card.Body>
              <h5>Detected Botnets</h5>
              <h2>20</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
