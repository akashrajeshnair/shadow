import React, { useState, useEffect, useCallback, useRef } from "react";
import { Table, Form, InputGroup, Image, Dropdown } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import "../assets/attacklogs.css";

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
  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [countryFlags, setCountryFlags] = useState({});
  const [hoveredField, setHoveredField] = useState(null);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const logsPerPage = 5;
  const fetchedIPs = useRef(new Set());

  const fetchLogs = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5174/api/attacklogs');
      const data = await response.json();
      // Clean up the received data
      const cleanedData = data.map(log => ({
        id: log._id,
        timestamp: log.timestamp,
        ip: log.ip,
        command: log.command,
        data: typeof log.data === 'object' ? JSON.stringify(log.data) : log.data,
        response: typeof log.response === 'object' ? JSON.stringify(log.response) : log.response,
        device: log.device,
        collectionName: log.collectionName
      }));
      console.log("Fetched logs:", cleanedData);
      setLogs(cleanedData);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const deviceOptions = ["All Devices", ...new Set(logs.map((log) => log.device))];

  // 🔹 Filtering Logs
  const filteredLogs = logs.filter((log) =>
    log.ip.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedDevice === "" || selectedDevice === "All Devices" || log.device === selectedDevice)
  );

  // 🔹 Sorting Logs
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    if (!sortField) return 0;
    const fieldA = a[sortField];
    const fieldB = b[sortField];
    if (sortOrder === "asc") {
      return fieldA > fieldB ? 1 : -1;
    } else {
      return fieldA < fieldB ? 1 : -1;
    }
  });

  const pageCount = Math.ceil(sortedLogs.length / logsPerPage);
  const handlePageClick = ({ selected }) => setCurrentPage(selected);
  const displayedLogs = sortedLogs.slice(currentPage * logsPerPage, (currentPage + 1) * logsPerPage);

  useEffect(() => {
    const fetchFlags = async () => {
      const newFlags = { ...countryFlags };
      for (let log of displayedLogs) {
        if (!fetchedIPs.current.has(log.ip)) {
          fetchedIPs.current.add(log.ip);
          newFlags[log.ip] = await getCountryFlag(log.ip);
        }
      }
      setCountryFlags(newFlags);
    };
    fetchFlags();
  }, [displayedLogs]);

  // 📊 Bar Chart Data (Attack Counts)
  const attackCounts = filteredLogs.reduce((acc, log) => {
    acc[log.collectionName] = (acc[log.collectionName] || 0) + 1;
    return acc;
  }, {});

  const attackTypeData = {
    labels: Object.keys(attackCounts),
    datasets: [
      {
        label: "Number of Attacks",
        data: Object.values(attackCounts),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"]
      }
    ]
  };

  // 📊 Pie Chart Data (Attack Distribution)
  const deviceData = {
    labels: Object.keys(attackCounts),
    datasets: [
      {
        data: Object.values(attackCounts),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"]
      }
    ]
  };

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

            {/* Device Filter Dropdown */}
            <Form.Select
              onChange={(e) => setSelectedDevice(e.target.value)}
              value={selectedDevice}
              style={{ fontSize: "12px", padding: "4px 8px", maxWidth: "200px" }}
            >
              {deviceOptions.map((device, index) => (
                <option key={index} value={device}>{device}</option>
              ))}
            </Form.Select>
          

          <Dropdown>
             <Dropdown.Toggle variant="dark" style={{ fontSize: "12px", padding: "4px 10px" }}>
               Sort By
             </Dropdown.Toggle>

             <Dropdown.Menu>
               {["ip", "collectionName", "device", "timestamp"].map((field) => (
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
              {displayedLogs.map((log, index) => (
                <tr key={log.id}>
                  <td>{currentPage * logsPerPage + index + 1}</td>
                  <td>{log.ip}</td>
                  <td><Image src={countryFlags[log.ip]} width="30" height="20" /></td>
                  <td>{log.collectionName}</td>
                  <td>{log.device}</td>
                  <td>{log.command}</td>
                  <td>{log.data}</td>
                  <td>{log.response}</td>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
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

      <div className="charts-container mt-5 d-flex flex-column align-items-center">
        <h3 className="mb-4">Attack Statistics</h3>

        <div className="d-flex flex-wrap justify-content-center w-100">
          {/* Chart 1 - Attack Frequency */}
          <div className="chart-box mx-3 p-3 shadow-lg rounded bg-white" style={{ width: "45%", minWidth: "300px" }}>
            <h5 className="text-center mb-2">Attack Frequency by Type</h5>
            <Bar data={attackTypeData} options={{ responsive: true, maintainAspectRatio: true }} />
          </div>

          {/* Chart 2 - Attack Distribution */}
          <div className="chart-box mx-3 p-3 shadow-lg rounded bg-white" style={{ width: "45%", minWidth: "300px" }}>
            <h5 className="text-center mb-2">Attack Distribution by Device</h5>
            <Pie data={deviceData} options={{ responsive: true, maintainAspectRatio: true }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttackLogs;