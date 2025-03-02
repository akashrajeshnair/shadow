import React from "react";
import "../assets/home.css";

const Home = () => {
  return (
    <div className="home-container">
      <section className="features">
        <div className="feature-card">
          <h3>Advanced Detection</h3>
          <p>Monitor and identify hacking attempts in real-time.</p>
        </div>
        <div className="feature-card">
          <h3>Honeypot Integration</h3>
          <p>Deceive attackers with smart IoT-based honeypots.</p>
        </div>
        <div className="feature-card">
          <h3>Detailed Attack Logs</h3>
          <p>Analyze logs and track suspicious activities.</p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h3>Stay One Step Ahead</h3>
        <p>Join the future of cybersecurity defense today.</p>
        <a href="/settings" className="cta-btn">Secure Your System</a>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Shadow. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
