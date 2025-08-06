import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/logs").then(res => setLogs(res.data));
  }, []);

  const getStatusClass = (status) => {
    if (status === "ERROR") return "error";
    if (status === "WARNING") return "warning";
    return "info";
  };

  return (
    <div className="App">
      <h1>Log Monitoring Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Job</th>
            <th>PID</th>
            <th>Duration (s)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index}>
              <td>{log.job}</td>
              <td>{log.pid}</td>
              <td>{log.duration}</td>
              <td className={getStatusClass(log.status)}>{log.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
