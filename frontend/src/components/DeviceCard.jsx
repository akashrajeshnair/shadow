import React from "react";
import { Card } from "react-bootstrap";
import ThreatLevelIndicator from "./ThreatLevelIndicator";

const DeviceCard = ({ name, onClick }) => {
  return (
    <Card className="p-3 shadow-sm device-card" onClick={onClick}>
      <Card.Body className="text-center">
        <h5>{name}</h5>
        <ThreatLevelIndicator device={name} />
      </Card.Body>
    </Card>
  );
};

export default DeviceCard;
