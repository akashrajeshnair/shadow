import React, { useState, useEffect } from "react";
import { Table, Card, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../assets/devicedetails.css";

const attackLogs = [
  { ip: "55.66.77.88", device: "Telnet Server", timestamp: "2025-03-01 18:00", command: "Zero-Day Exploit" },
];

const TelnetServer = () => {
  const navigate = useNavigate();
  const [attackDetails, setAttackDetails] = useState({});
  const [blockedIPs, setBlockedIPs] = useState([]);

  useEffect(() => {
    const groupedLogs = {};
    attackLogs
      .filter(log => log.device === "Telnet Server")
      .forEach(log => {
        if (!groupedLogs[log.ip]) {
          groupedLogs[log.ip] = [];
        }
        groupedLogs[log.ip].push({ timestamp: log.timestamp, command: log.command });
      });

    const sortedLogs = Object.entries(groupedLogs).sort((a, b) => b[1].length - a[1].length);
    setAttackDetails(Object.fromEntries(sortedLogs));
  }, []);

  const handleBlockIP = (ip) => {
    setBlockedIPs((prevBlocked) => [...prevBlocked, ip]);
  };

  return (
    <Container className="device-container">
      <Card className="device-header">
        <Card.Body>
          <h2>Telnet Server - Attack Details</h2>
          <button className="back-button" onClick={() => navigate("/")}>← Back to Dashboard</button>
        </Card.Body>
      </Card>

      {Object.keys(attackDetails).length > 0 ? (
        <Table striped bordered hover className="attack-table">
          <thead>
            <tr>
              <th>IP Address</th>
              <th>Timestamp</th>
              <th>Command</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(attackDetails).map(([ip, logs]) => (
              <React.Fragment key={ip}>
                <tr className={`ip-header ${blockedIPs.includes(ip) ? "blocked" : ""}`}>
                  <td colSpan="3"><strong>IP: {ip} ({logs.length} Attempts)</strong></td>
                  <td>
                    <Button 
                      variant="danger" 
                      onClick={() => handleBlockIP(ip)} 
                      disabled={blockedIPs.includes(ip)}
                    >
                      {blockedIPs.includes(ip) ? "Blocked" : "Block IP"}
                    </Button>
                  </td>
                </tr>
                {logs.map((log, index) => (
                  <tr key={index} className={blockedIPs.includes(ip) ? "blocked" : ""}>
                    <td></td>
                    <td>{log.timestamp}</td>
                    <td>{log.command}</td>
                    <td></td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="no-attacks">No attacks recorded for Telnet Server.</p>
      )}
    </Container>
  );
};

export default TelnetServer;
