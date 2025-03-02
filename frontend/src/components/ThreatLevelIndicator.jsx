import React from "react";
import { Badge } from "react-bootstrap";

// Sample attack logs (Replace with real API data)
const attackLogs = [
  { ip: "192.168.1.10", device: "Router" },
  { ip: "203.0.113.45", device: "Telnet" },
  { ip: "203.0.113.45", device: "File Server" },
  { ip: "182.75.45.67", device: "MQTT" },
  { ip: "182.75.45.67", device: "MQTT" },
  { ip: "55.66.77.88", device: "Telnet" },
  { ip: "192.168.1.23", device: "SSH" },
  { ip: "99.12.34.56", device: "File Service" },
  { ip: "99.12.34.56", device: "File Service" },
  { ip: "99.12.34.56", device: "File Service" },
];

// Function to count attacks per device
const countAttacks = () => {
  const attackCount = {};
  attackLogs.forEach((log) => {
    attackCount[log.device] = (attackCount[log.device] || 0) + 1;
  });
  return attackCount;
};

// Function to determine threat level based on attack count
const getThreatLevel = (count) => {
  if (count >= 5) return "Critical"; // 5 or more attacks → Critical
  if (count >= 3) return "High"; // 3-4 attacks → High
  if (count >= 2) return "Medium"; // 2 attacks → Medium
  if (count === 1) return "Low"; // 1 attack → Low
  return "None"; // 0 attacks → No threat
};

// Function to determine badge color
const getBadgeVariant = (level) => {
  switch (level) {
    case "Critical": return "dark";
    case "High": return "danger";
    case "Medium": return "warning";
    case "Low": return "success";
    default: return "secondary"; // "None" or unknown threats
  }
};

const ThreatLevelIndicator = ({ device }) => {
  const attackCount = countAttacks();
  const level = getThreatLevel(attackCount[device] || 0); // Default to 0 if no attacks

  return <Badge bg={getBadgeVariant(level)}>{level} Threat</Badge>;
};

export default ThreatLevelIndicator;

