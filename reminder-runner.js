// reminder-runner.js
const notifier = require("node-notifier");
const { mark_reminder_completed } = require("./utils/reminder-utility");

const [_, __, message, duration] = process.argv;

setTimeout(() => {
  notifier.notify({
    title: "⏰ Reminder",
    message,
  });

  mark_reminder_completed(message, Date.now());
}, parseInt(duration));
