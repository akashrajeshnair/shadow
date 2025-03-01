import React, { useState, useEffect, useRef } from "react";
import { Table, Form, InputGroup, Button, Image, Dropdown } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);


const getCountryFlag = async (ip) => {
  try {
    if (ip.startsWith("192.168") || ip.startsWith("10.") || ip.startsWith("172.")) {
      return "https://flagcdn.com/w40/unknown.png";
    }
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await response.json();
    return data.status === "success"
      ? `https://flagcdn.com/w40/${data.countryCode.toLowerCase()}.png`
      : "https://flagcdn.com/w40/unknown.png";
  } catch (error) {
    return "https://flagcdn.com/w40/unknown.png";
  }
};

const AttackLogs = () => {
  const initialLogs = [
    { id: 1, ip: "203.0.113.45", attackType: "SQL Injection", timestamp: "2025-03-01 14:30", device: "Router-01", command: "SELECT * FROM users", data: "SQL Payload", response: "403 Forbidden" },
    { id: 2, ip: "198.51.100.22", attackType: "Brute Force", timestamp: "2025-03-01 15:10", device: "Firewall", command: "Login Attempt", data: "admin/password", response: "Access Denied" },
    { id: 3, ip: "145.67.89.101", attackType: "DDoS", timestamp: "2025-03-01 15:45", device: "Server-03", command: "Flood Attack", data: "1000 requests/sec", response: "Rate Limited" },
    { id: 4, ip: "185.21.30.5", attackType: "Mirai Botnet", timestamp: "2025-03-01 16:00", device: "IoT Camera", command: "Exploit Payload", data: "Mirai Code", response: "Blocked" },
    { id: 5, ip: "14.99.167.142", attackType: "SQL Injection", timestamp: "2025-03-01 16:20", device: "Database Server", command: "DROP TABLE users", data: "SQL Query", response: "Error Logged" }
  ];

  const [logs, setLogs] = useState(initialLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [countryFlags, setCountryFlags] = useState({});
  const [hoveredField, setHoveredField] = useState(null);
  const logsPerPage = 3;

  const sortLogs = (field, order) => {
    const sorted = [...logs].sort((a, b) => {
      let valA = a[field];
      let valB = b[field];
      if (field === "timestamp") {
        valA = new Date(valA);
        valB = new Date(valB);
      }
      return order === "asc" ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });
    setLogs(sorted);
  };

  useEffect(() => {
    if (sortField && sortOrder) {
      sortLogs(sortField, sortOrder);
    }
  }, [sortField, sortOrder]);

  const pageCount = Math.ceil(logs.length / logsPerPage);
  const handlePageClick = ({ selected }) => setCurrentPage(selected);
  const displayedLogs = logs.slice(currentPage * logsPerPage, (currentPage + 1) * logsPerPage);

  useEffect(() => {
    const fetchFlags = async () => {
      const newFlags = { ...countryFlags };
      for (let log of displayedLogs) {
        if (!newFlags[log.ip]) {
          newFlags[log.ip] = await getCountryFlag(log.ip);
        }
      }
      setCountryFlags(newFlags);
    };
    fetchFlags();
  }, [displayedLogs]);

  return (
    <div>
    <div className="d-flex flex-column align-items-center mt-4">
      <div className="log-container w-100 px-4">
        <h2 className="align-self-start ms-3">Attack Logs</h2>

        <div className="d-flex justify-content-end mb-2 w-100 px-3">
          <InputGroup style={{ maxWidth: "200px" }}>
            <Form.Control
              type="text"
              placeholder="Search IP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ fontSize: "12px", padding: "4px 8px" }}
            />
          </InputGroup>

          <Form.Select
            onChange={(e) => setFilterType(e.target.value)}
            style={{ fontSize: "12px", padding: "4px 8px", maxWidth: "150px" }}
          >
            <option value="">All Attacks</option>
            <option value="SQL Injection">SQL Injection</option>
            <option value="Brute Force">Brute Force</option>
            <option value="DDoS">DDoS</option>
            <option value="Mirai Botnet">Mirai Botnet</option>
          </Form.Select>

          {/* Sorting Dropdown with Hover-Based Submenus */}
          <Dropdown>
            <Dropdown.Toggle variant="dark" style={{ fontSize: "12px", padding: "4px 10px" }}>
              Sort By
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {["ip", "attackType", "device", "timestamp"].map((field) => (
                <Dropdown.Item
                  key={field}
                  onMouseEnter={() => setHoveredField(field)}
                  onMouseLeave={() => setHoveredField(null)}
                  className="position-relative"
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}

                  {hoveredField === field && (
                    <div
                      className="position-absolute bg-white border shadow p-2"
                      style={{ right: "100%", top: "0", minWidth: "120px", zIndex: 10 }}
                    >
                      <div
                        className="dropdown-item"
                        onClick={() => { setSortField(field); setSortOrder("asc"); }}
                      >
                        Ascending
                      </div>
                      <div
                        className="dropdown-item"
                        onClick={() => { setSortField(field); setSortOrder("desc"); }}
                      >
                        Descending
                      </div>
                    </div>
                  )}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <Table striped bordered hover size="sm" className="w-100">
          <thead>
            <tr>
    <th style={{ width: "5%" }}>#</th>
    <th style={{ width: "15%" }}>IP Address</th>
    <th style={{ width: "10%" }}>Country</th>
    <th style={{ width: "15%" }}>Attack Type</th>
    <th style={{ width: "15%" }}>Device</th>
    <th style={{ width: "15%" }}>Command</th>
    <th style={{ width: "15%" }}>Data</th>
    <th style={{ width: "15%" }}>Response</th>
    <th style={{ width: "15%" }}>Timestamp</th>
 
            </tr>
          </thead>
          <tbody>
            {displayedLogs.map((log) => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{log.ip}</td>
                <td><Image src={countryFlags[log.ip]} width="30" height="20" /></td>
                <td>{log.attackType}</td>
                <td>{log.device}</td>
                <td>{log.command}</td>
                <td>{log.data}</td>
                <td>{log.response}</td>
                <td>{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
       <ReactPaginate
    previousLabel={"← Prev"}
    nextLabel={"Next →"}
    breakLabel={"..."}
    pageCount={pageCount}
    marginPagesDisplayed={1}
    pageRangeDisplayed={3}
    onPageChange={handlePageClick}
    containerClassName={"pagination justify-content-center"}
    pageClassName={"page-item"}
    pageLinkClassName={"page-link"}
    previousClassName={"page-item"}
    previousLinkClassName={"page-link"}
    nextClassName={"page-item"}
    nextLinkClassName={"page-link"}
    breakClassName={"page-item"}
    breakLinkClassName={"page-link"}
    activeClassName={"active"}
  />
    </div>
    <div>
      
    </div>
    </div>
  );
};

export default AttackLogs;


{/* <ReactPaginate
    previousLabel={"← Prev"}
    nextLabel={"Next →"}
    breakLabel={"..."}
    pageCount={pageCount}
    marginPagesDisplayed={1}
    pageRangeDisplayed={3}
    onPageChange={handlePageClick}
    containerClassName={"pagination justify-content-center"}
    pageClassName={"page-item"}
    pageLinkClassName={"page-link"}
    previousClassName={"page-item"}
    previousLinkClassName={"page-link"}
    nextClassName={"page-item"}
    nextLinkClassName={"page-link"}
    breakClassName={"page-item"}
    breakLinkClassName={"page-link"}
    activeClassName={"active"}
  /> */}
