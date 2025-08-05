const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

const LOG_FILE = "logs.log";
const WARNING_THRESHOLD = 5 * 60;
const ERROR_THRESHOLD = 10 * 60;

app.use(cors());

function parseLogs() {
  const logs = fs.readFileSync(LOG_FILE, "utf8").split("\n").filter(Boolean);
  return logs.map(line => {
    const [time, job, status, pid] = line.split(",");
    return { timestamp: time.trim(), job: job.trim(), status: status.trim(), pid: pid.trim() };
  });
}

function timeToSeconds(timeStr) {
  const [hh, mm, ss] = timeStr.split(":").map(Number);
  return hh * 3600 + mm * 60 + ss;
}

function generateReport() {
  const logs = parseLogs();
  const startTimes = {};
  const report = [];

  logs.forEach(log => {
    const { pid, timestamp, job, status } = log;
    const timeInSec = timeToSeconds(timestamp);

    if (status === "START") {
      startTimes[pid] = timeInSec;
    } else if (status === "END") {
      if (startTimes[pid] !== undefined) {
        const duration = timeInSec - startTimes[pid];
        let message = "INFO";
        if (duration > ERROR_THRESHOLD) message = "ERROR";
        else if (duration > WARNING_THRESHOLD) message = "WARNING";

        report.push({ job, pid, duration, status: message });
        delete startTimes[pid];
      }
    }
  });

  return report;
}

// API Endpoint
app.get("/logs", (req, res) => {
  res.json(generateReport());
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
