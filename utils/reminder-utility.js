const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const filePath = path.join(__dirname, "../reminders.json");

const readFile = () => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]");
  }
  const content = fs.readFileSync(filePath, "utf-8");
  try {
    return JSON.parse(content.trim() || "[]");
  } catch (err) {
    console.error("❌ Failed to parse reminders.json. Resetting file.");
    fs.writeFileSync(filePath, "[]");
    return [];
  }
};

const writeFile = (content) => {
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
};

const add_reminder = (message, time) => {
  const err = [];
  const mess = [];
  try {
    const reminders = readFile();
    const id = reminders.length + 1;
    const reminder = {
      id,
      message,
      time,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      setTime: new Date().toLocaleTimeString(),
    };
    reminders.push(reminder);
    writeFile(reminders);
    mess.push({ message: `Reminder Id: ${id}` });
    return { err, mess };
  } catch (error) {
    err.push({ error: error.message });
    return { err, mess };
  }
};

const mark_reminder_completed = (message, fireTime) => {
  try {
    const reminders = readFile();
    const now = Date.now();
    const updated = reminders.map((reminder) => {
      if (
        reminder.message === message &&
        Math.abs(reminder.time - fireTime) < 30000 &&
        reminder.status !== "completed"
      ) {
        return {
          ...reminder,
          status: "completed",
          completedAt: new Date().toISOString(),
        };
      }
      return reminder;
    });
    writeFile(updated);
  } catch (error) {
    console.error("❌ Could not mark reminder as completed:", error.message);
  }
};

const schedule_reminder = (message, duration) => {
  const runnerPath = path.join(__dirname, "../reminder-runner.js");

  const subprocess = spawn(process.execPath, [runnerPath, message, duration], {
    detached: true,
    stdio: "ignore",
  });

  subprocess.unref();
};

module.exports = { add_reminder, mark_reminder_completed, schedule_reminder };
