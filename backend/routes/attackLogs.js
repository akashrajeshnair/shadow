const express = require('express');
const attackLogsRouter = express.Router();
const mongoose = require('mongoose');

// Define the schema
const attackLogSchema = new mongoose.Schema({
  timestamp: Date,
  ip: String,
  command: String,
  data: String,
  response: String,
  device: String
});

// Create models for each collection
const FtpLog = mongoose.model('FtpLog', attackLogSchema, 'ftp_logs');
const TelnetLog = mongoose.model('TelnetLog', attackLogSchema, 'telnet_logs');
const SshLog = mongoose.model('SshLog', attackLogSchema, 'ssh_logs');
const RouterLog = mongoose.model('RouterLog', attackLogSchema, 'router_logs');
const MqttLog = mongoose.model('MqttLog', attackLogSchema, 'mqtt_logs');

// GET endpoint to fetch attack logs from all collections
attackLogsRouter.get('/attacklogs', async (req, res) => {
  try {
    console.log("Fetching logs from all collections...");

    // Fetch logs from each collection
    const ftpLogs = await FtpLog.find().select('-_id').lean().exec();
    console.log("Fetched FTP logs:", ftpLogs);

    const telnetLogs = await TelnetLog.find().select('-_id').lean().exec();
    console.log("Fetched Telnet logs:", telnetLogs);

    const sshLogs = await SshLog.find().select('-_id').lean().exec();
    console.log("Fetched SSH logs:", sshLogs);

    const routerLogs = await RouterLog.find().select('-_id').lean().exec();
    console.log("Fetched Router logs:", routerLogs);

    const mqttLogs = await MqttLog.find().select('-_id').lean().exec();
    console.log("Fetched MQTT logs:", mqttLogs);

    // Add collection name attribute
    const addCollectionName = (logs, collectionName) => logs.map(log => ({ ...log, collectionName }));

    // Combine all logs
    const allLogs = [
      ...addCollectionName(ftpLogs, 'ftp_logs'),
      ...addCollectionName(telnetLogs, 'telnet_logs'),
      ...addCollectionName(sshLogs, 'ssh_logs'),
      ...addCollectionName(routerLogs, 'router_logs'),
      ...addCollectionName(mqttLogs, 'mqtt_logs')
    ];

    console.log("Combined logs:", allLogs);

    // Send combined logs as JSON response
    res.json(allLogs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = attackLogsRouter;