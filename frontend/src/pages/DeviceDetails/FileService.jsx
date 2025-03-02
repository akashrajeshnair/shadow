import React, { useState, useEffect } from "react";
import { Table, Card, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../assets/devicedetails.css"; // Import CSS for styling

const attackLogs = [
  { ip: "99.12.34.56", device: "File Service", timestamp: "2025-03-01 19:30", command: "Malware Injection" },
  { ip: "99.12.34.56", device: "File Service", timestamp: "2025-03-01 20:10", command: "Privilege Escalation" },
  { ip: "88.44.77.99", device: "File Service", timestamp: "2025-03-01 21:00", command: "Brute Force Attack" },
  { ip: "88.44.77.99", device: "File Service", timestamp: "2025-03-01 21:30", command: "SQL Injection" },
  { ip: "88.44.77.99", device: "File Service", timestamp: "2025-03-01 22:00", command: "Ransomware Deployment" },
];

const FileService = () => {
  const navigate = useNavigate();
  const [attackDetails, setAttackDetails] = useState({});
  const [blockedIPs, setBlockedIPs] = useState([]); // Store blocked IPs

  // Group attacks by IP and sort them by the number of attempts (descending)
  useEffect(() => {
    const groupedLogs = {};
    attackLogs
      .filter(log => log.device === "File Service")
      .forEach(log => {
        if (!groupedLogs[log.ip]) {
          groupedLogs[log.ip] = [];
        }
        groupedLogs[log.ip].push({ timestamp: log.timestamp, command: log.command });
      });

    const sortedLogs = Object.entries(groupedLogs).sort((a, b) => b[1].length - a[1].length);
    setAttackDetails(Object.fromEntries(sortedLogs));
  }, []);

  // Function to block an IP
  const handleBlockIP = (ip) => {
    setBlockedIPs((prevBlocked) => [...prevBlocked, ip]); // Add to blocked list
  };

  return (
    <Container className="device-container">
      <Card className="device-header">
        <Card.Body>
          <h2>File Service - Attack Details</h2>
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
        <p className="no-attacks">No attacks recorded for File Service.</p>
      )}
    </Container>
  );
};

export default FileService;
