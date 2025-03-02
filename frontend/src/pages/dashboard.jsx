import React, { useState, useEffect } from "react";
import { Container, Row, Col, Modal, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DeviceCard from "../components/DeviceCard";
import "../assets/dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [attackLogs, setAttackLogs] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [attackDetails, setAttackDetails] = useState({});

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('http://localhost:5174/api/attacklogs');
        const data = await response.json();
        setAttackLogs(data);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };
    fetchLogs();
  }, []);

  const devices = [
    { name: "File Service", route: "/DeviceDetails/FileService" },
    { name: "MQTT", route: "/DeviceDetails/MQTT" },
    { name: "Telnet", route: "/DeviceDetails/Telnet" },
    { name: "Router", route: "/DeviceDetails/Router" },
    { name: "SSH", route: "/DeviceDetails/SSH" },
  ];

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
