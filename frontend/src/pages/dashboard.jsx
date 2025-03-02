import React, { useState } from "react";
import { Container, Row, Col, Modal, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DeviceCard from "../components/DeviceCard";
import "../assets/dashboard.css";

// Sample attack logs (Replace with real API data)
const attackLogs = [
  { ip: "192.168.1.10", device: "Router", timestamp: "2025-03-01 12:30", command: "Port Scan" },
  { ip: "203.0.113.45", device: "Router", timestamp: "2025-03-01 14:30", command: "SQL Injection" },
  { ip: "203.0.113.45", device: "Router", timestamp: "2025-03-01 15:00", command: "Brute Force" },
  { ip: "182.75.45.67", device: "MQTT Iot Devices", timestamp: "2025-03-01 16:50", command: "XSS Attack" },
  { ip: "182.75.45.67", device: "MQTT Iot Devices", timestamp: "2025-03-01 17:10", command: "RCE Attack" },
  { ip: "55.66.77.88", device: "Telnet Server", timestamp: "2025-03-01 18:00", command: "Zero-Day Exploit" },
  { ip: "192.168.1.23", device: "SSH Device", timestamp: "2025-03-01 18:30", command: "Packet Sniffing" },
  { ip: "99.12.34.56", device: "File Service", timestamp: "2025-03-01 19:30", command: "Malware Injection" },
  { ip: "99.12.34.56", device: "File Service", timestamp: "2025-03-01 20:10", command: "Privilege Escalation" },
];

// Device list with correct routes
const devices = [
  { name: "File Service", route: "/DeviceDetails/FileService" },
  { name: "MQTT", route: "/DeviceDetails/MQTT" },
  { name: "Telnet", route: "/DeviceDetails/Telnet" },
  { name: "Router", route: "/DeviceDetails/Router" },
  { name: "SSH", route: "/DeviceDetails/SSH" },
];

// Function to group and sort attacks by IP
const groupAndSortAttacks = (deviceName) => {
  const filteredLogs = attackLogs.filter((log) => log.device === deviceName);
  const groupedLogs = {};

  filteredLogs.forEach((log) => {
    if (!groupedLogs[log.ip]) {
      groupedLogs[log.ip] = [];
    }
    groupedLogs[log.ip].push({
      timestamp: log.timestamp,
      command: log.command,
    });
  });

  return Object.entries(groupedLogs)
    .sort((a, b) => b[1].length - a[1].length)
    .reduce((acc, [ip, logs]) => ({ ...acc, [ip]: logs }), {});
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [attackDetails, setAttackDetails] = useState({});

  const handleDeviceClick = (deviceName) => {
    const device = devices.find((d) => d.name === deviceName);
    if (device) {
      navigate(device.route);
    }
  };

  return (
    <Container className="dashboard-container mt-4">
      <h2 className="text-center mb-4">Threat Monitoring Dashboard</h2>

      <Row className="justify-content-center">
        {devices.map((device, index) => (
          <Col md={4} key={index} className="mb-4">
            <DeviceCard name={device.name} onClick={() => handleDeviceClick(device.name)} />
          </Col>
        ))}
      </Row>

      {showModal && (
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Attack Details for {selectedDevice}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {Object.keys(attackDetails).length > 0 ? (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>IP Address</th>
                    <th>Timestamp</th>
                    <th>Command</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(attackDetails).map(([ip, logs]) => (
                    <React.Fragment key={ip}>
                      <tr className="table-active">
                        <td colSpan="3"><strong>IP: {ip} (Attempts: {logs.length})</strong></td>
                      </tr>
                      {logs.map((log, index) => (
                        <tr key={index}>
                          <td></td>
                          <td>{log.timestamp}</td>
                          <td>{log.command}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>No attacks recorded for this device.</p>
            )}
          </Modal.Body>
        </Modal>
      )}
    </Container>
  );
};

export default Dashboard;
