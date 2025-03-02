const express = require('express');
const router = express.Router();
const BlockedUser = require('../models/blocked');

// Route to check if an IP is blocked
router.get('/isBlocked/:ip', async (req, res) => {
  try {
    const { ip } = req.params;
    const blockedUser = await BlockedUser.findOne({ ip });
    if (blockedUser) {
      return res.status(200).json({ blocked: true });
    }
    return res.status(200).json({ blocked: false });
  } catch (error) {
    console.error("Error checking blocked IP:", error);
    res.status(500).json({ message: error.message });
  }
});

// Route to add an IP to the blocked users collection
router.post('/block', async (req, res) => {
  try {
    const { ip } = req.body;
    const newBlockedUser = new BlockedUser({ ip });
    await newBlockedUser.save();
    res.status(201).json({ message: "IP address blocked successfully" });
  } catch (error) {
    console.error("Error blocking IP:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;