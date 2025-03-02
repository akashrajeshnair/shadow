// import React, { useState, useEffect, useRef } from "react";
// import { Table, Form, InputGroup, Button, Image, Dropdown } from "react-bootstrap";
// import ReactPaginate from "react-paginate";
// import { Bar, Pie } from "react-chartjs-2";
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
// import "../assets/attacklogs.css";

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// const getCountryFlag = async (ip) => {
//   try {
//     if (ip.startsWith("192.168") || ip.startsWith("10.") || ip.startsWith("172.")) {
//       return "https://flagcdn.com/w40/unknown.png";
//     }
//     const response = await fetch(`http://ip-api.com/json/${ip}`);
//     const data = await response.json();
//     return data.status === "success"
//       ? `https://flagcdn.com/w40/${data.countryCode.toLowerCase()}.png`
//       : "https://flagcdn.com/w40/unknown.png";
//   } catch (error) {
//     return "https://flagcdn.com/w40/unknown.png";
//   }
// };

// const AttackLogs = () => {
  
//   const [logs, setLogs] = useState(initialLogs);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterType, setFilterType] = useState("");
//   const [sortField, setSortField] = useState(null);
//   const [sortOrder, setSortOrder] = useState(null);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [countryFlags, setCountryFlags] = useState({});
//   const [hoveredField, setHoveredField] = useState(null);
//   const logsPerPage = 5;
 
//   const sortLogs = (field, order) => {
//     const sorted = [...logs].sort((a, b) => {
//       let valA = a[field];
//       let valB = b[field];
//       if (field === "timestamp") {
//         valA = new Date(valA);
//         valB = new Date(valB);
//       }
//       return order === "asc" ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
//     });
//     setLogs(sorted);
//   };

//   useEffect(() => {
//     if (sortField && sortOrder) {
//       sortLogs(sortField, sortOrder);
//     }
//   }, [sortField, sortOrder]);

  
//   const pageCount = Math.ceil(logs.length / logsPerPage);
//   const handlePageClick = ({ selected }) => setCurrentPage(selected);
//   const displayedLogs = logs.slice(currentPage * logsPerPage, (currentPage + 1) * logsPerPage);

//   useEffect(() => {
//     const fetchFlags = async () => {
//       const newFlags = { ...countryFlags };
//       for (let log of displayedLogs) {
//         if (!newFlags[log.ip]) {
//           newFlags[log.ip] = await getCountryFlag(log.ip);
//         }
//       }
//       setCountryFlags(newFlags);
//     };
//     fetchFlags();
//   }, [displayedLogs]);

  

//   // Prepare Data for Graphs
//   const attackCounts = logs.reduce((acc, log) => {
//     acc[log.attackType] = (acc[log.attackType] || 0) + 1;
//     return acc;
//   }, {});

//   const deviceCounts = logs.reduce((acc, log) => {
//     acc[log.device] = (acc[log.device] || 0) + 1;
//     return acc;
//   }, {});

//   // Graph Data
//   const attackTypeData = {
//     labels: Object.keys(attackCounts),
//     datasets: [
//       {
//         label: "Attack Count",
//         data: Object.values(attackCounts),
//         backgroundColor: ["#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0", "#9966ff"],
//       },
//     ],
//   };

//   const deviceData = {
//     labels: Object.keys(deviceCounts),
//     datasets: [
//       {
//         label: "Device Attacks",
//         data: Object.values(deviceCounts),
//         backgroundColor: ["#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0", "#9966ff"],
//       },
//     ],
//   };

//   return (
//     <div>
//     <div className="d-flex flex-column align-items-center mt-4">
//       <div className="log-container w-100 px-4">
//         <h2 className="align-self-start ms-3">Attack Logs</h2>

//         <div className="d-flex justify-content-end mb-2 w-100 px-3">
//           <InputGroup style={{ maxWidth: "200px" }}>
//             <Form.Control
//               type="text"
//               placeholder="Search IP..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               style={{ fontSize: "12px", padding: "4px 8px" }}
//             />
//           </InputGroup>

//           <Form.Select
//             onChange={(e) => setFilterType(e.target.value)}
//             style={{ fontSize: "12px", padding: "4px 8px", maxWidth: "150px" }}
//           >

//             <option value="">All Attacks</option>
//             <option value="SQL Injection">SQL Injection</option>
//             <option value="Brute Force">Brute Force</option>
//             <option value="DDoS">DDoS</option>
//             <option value="Mirai Botnet">Mirai Botnet</option>
//           </Form.Select>

//           {/* Sorting Dropdown with Hover-Based Submenus */}
//           <Dropdown>
//             <Dropdown.Toggle variant="dark" style={{ fontSize: "12px", padding: "4px 10px" }}>
//               Sort By
//             </Dropdown.Toggle>

//             <Dropdown.Menu>
//               {["ip", "attackType", "device", "timestamp"].map((field) => (
//                 <Dropdown.Item
//                   key={field}
//                   onMouseEnter={() => setHoveredField(field)}
//                   onMouseLeave={() => setHoveredField(null)}
//                   className="position-relative"
//                 >
//                   {field.charAt(0).toUpperCase() + field.slice(1)}

//                   {hoveredField === field && (
//                     <div
//                       className="position-absolute bg-white border shadow p-2"
//                       style={{ right: "100%", top: "0", minWidth: "120px", zIndex: 10 }}
//                     >
//                       <div
//                         className="dropdown-item"
//                         onClick={() => { setSortField(field); setSortOrder("asc"); }}
//                       >
//                         Ascending
//                       </div>
//                       <div
//                         className="dropdown-item"
//                         onClick={() => { setSortField(field); setSortOrder("desc"); }}
//                       >
//                         Descending
//                       </div>
//                     </div>
//                   )}
//                 </Dropdown.Item>
//               ))}
//             </Dropdown.Menu>
//           </Dropdown>
//         </div>
//           <Table striped bordered hover size="sm" className="w-100">
//             <thead>
//               <tr>
              
//               </tr>
//             </thead>
//             <tbody>
//               {displayedLogs.map((log) => (
//                 <tr key={log.id}>
//                   <td>{log.id}</td>
//                   <td>{log.ip}</td>
//                   <td><Image src={countryFlags[log.ip]} width="30" height="20" /></td>
//                   <td>{log.attackType}</td>
//                   <td>{log.device}</td>
//                   <td>{log.command}</td>
//                   <td>{log.data}</td>
//                   <td>{log.response}</td>
//                   <td>{log.timestamp}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </div>

//         
    
    
//   </div>
// </div>


//     </div>
//   );
// };

// export default AttackLogs;
import React, { useState, useEffect } from "react";
import { Table, Form, InputGroup, Image, Dropdown} from "react-bootstrap";
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
  const initialLogs = [
    { id: 1, ip: "203.0.113.45", attackType: "SQL Injection", timestamp: "2025-03-01 14:30", device: "Router-01", command: "SELECT * FROM users", data: "SQL Payload", response: "403 Forbidden" },
    { id: 2, ip: "198.51.100.22", attackType: "Brute Force", timestamp: "2025-03-01 15:10", device: "Firewall", command: "Login Attempt", data: "admin/password", response: "Access Denied" },
    { id: 3, ip: "145.67.89.101", attackType: "DDoS", timestamp: "2025-03-01 15:45", device: "Server-03", command: "Flood Attack", data: "1000 requests/sec", response: "Rate Limited" },
    { id: 4, ip: "185.21.30.5", attackType: "Mirai Botnet", timestamp: "2025-03-01 16:00", device: "IoT Camera", command: "Exploit Payload", data: "Mirai Code", response: "Blocked" },
    { id: 5, ip: "14.99.167.142", attackType: "SQL Injection", timestamp: "2025-03-01 16:20", device: "Database Server", command: "DROP TABLE users", data: "SQL Query", response: "Error Logged" },
    { id: 6, ip: "182.75.45.67", attackType: "Cross-Site Scripting (XSS)", timestamp: "2025-03-01 16:50", device: "Web Server", command: "<script>alert('Hacked');</script>", data: "XSS Payload", response: "Blocked" },
    { id: 7, ip: "99.12.34.56", attackType: "Remote Code Execution (RCE)", timestamp: "2025-03-01 17:15", device: "Application Server", command: "exec('malicious_code')", data: "Python Exploit", response: "Access Denied" },
    { id: 8, ip: "55.66.77.88", attackType: "Zero-Day Exploit", timestamp: "2025-03-01 18:00", device: "Firewall", command: "Unknown Exploit", data: "Custom Payload", response: "Detected & Logged" },
    { id: 9, ip: "102.168.1.23", attackType: "Man-in-the-Middle (MitM)", timestamp: "2025-03-01 18:30", device: "Network Gateway", command: "Packet Sniffing", data: "Captured Data", response: "Blocked" },
    { id: 10, ip: "73.22.134.200", attackType: "Phishing Attempt", timestamp: "2025-03-01 19:00", device: "Email Server", command: "Fake Login Page", data: "User Credentials", response: "Marked as Spam" },
    { id: 11, ip: "190.45.123.78", attackType: "Malware Injection", timestamp: "2025-03-01 19:30", device: "Cloud Storage", command: "Trojan Upload", data: "malware.exe", response: "Quarantined" },
    { id: 12, ip: "65.78.99.101", attackType: "Privilege Escalation", timestamp: "2025-03-01 20:00", device: "Linux Server", command: "sudo exploit", data: "Root Access Attempt", response: "Denied" },
    { id: 13, ip: "202.45.67.89", attackType: "DNS Spoofing", timestamp: "2025-03-01 20:45", device: "DNS Server", command: "Fake IP Resolution", data: "Hijacked Response", response: "Mitigated" },
    { id: 14, ip: "88.77.66.55", attackType: "ARP Spoofing", timestamp: "2025-03-01 21:10", device: "Router-02", command: "Poisoned ARP Cache", data: "Intercepted Traffic", response: "Blocked" },
    { id: 15, ip: "54.32.10.98", attackType: "Ransomware Attack", timestamp: "2025-03-01 21:30", device: "Corporate Server", command: "Encrypt Files", data: "Ransom Note", response: "Backup Restored" }
  ];
  const [logs, setLogs] = useState(initialLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [countryFlags, setCountryFlags] = useState({});
  const [hoveredField, setHoveredField] = useState(null);
  const logsPerPage = 5;

  const deviceOptions = ["All Devices", ...new Set(initialLogs.map((log) => log.device))];

  // 🔹 Filtering Logs
  const filteredLogs = logs.filter((log) =>
    log.ip.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedDevice === "" || selectedDevice === "All Devices" || log.device === selectedDevice)
  );

  const pageCount = Math.ceil(filteredLogs.length / logsPerPage);
  const handlePageClick = ({ selected }) => setCurrentPage(selected);
  const displayedLogs = filteredLogs.slice(currentPage * logsPerPage, (currentPage + 1) * logsPerPage);

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

  // 📊 Bar Chart Data (Attack Counts)
  const attackCounts = filteredLogs.reduce((acc, log) => {
    acc[log.attackType] = (acc[log.attackType] || 0) + 1;
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


