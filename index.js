#!/usr/bin/env node

const { Command } = require("commander");
const chalk = require("chalk");
const ora = require("ora");
const ms = require("ms");
const { addNote, list_notes, delete_note } = require("./utils/notes-utility");
const {
  add_task,
  logging,
  list_tasks,
  delete_taks,
  complete_task,
} = require("./utils/task-utility");
const {
  add_reminder,
  schedule_reminder,
  get_all_reminders,
  delete_reminder,
} = require("./utils/reminder-utility");

const program = new Command();

program
  .name("mycli")
  .description("CLI tool to manage notes and tasks")
  .version("1.0.0");

program
  .command("add-note")
  .description("Adding a new note")
  .argument("[title]", "Title")
  .option("-b --bullets <bullets...>", "Notes")
  .option("-t --tags <tags...>", "Tags associated with a note")
  .option("-h --help", "Show help for add-note")
  .action((title, options) => {
    if (options.help || !title) {
      console.log("=========================================");
      console.log("📝 Command: add-note");
      console.log("-----------------------------------------");
      console.log("📌 Usage:");
      console.log("  add-note `note title` [options]");
      console.log("");
      console.log("🔧 Options:");
      console.log("  -b, --bullets     Add bullet points under the note");
      console.log("  -t, --tags        Add one or more tags to the note");
      console.log("");
      console.log("💡 Example:");
      console.log("  add-note `Octernships are on hold` ");
      console.log(
        "    --bullets `GitHub is not willing to continue octernships` "
      );
      console.log("              `Maybe it can be resumed a year later` ");
      console.log("    --tags `github` `octernship` `internship`");
      console.log("=========================================");
      return;
    }
    if (!title) {
      console.error("❌ Error: Title is required to add a note.");
      console.log(chalk.yellow("Use `add-note -h` for usage info."));
      process.exit(1);
    }
    const spinner = ora("Proccessing your request").start();
    const bullets = options.bullets || [];
    const tags = options.tags || [];
    const { err, mess } = addNote(title, bullets, tags);
    setTimeout(() => {
      if (err.length == 0) {
        spinner.succeed("Request proccessed");
        console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
        mess.map((item) => {
          console.log(chalk.yellow("--"), item.message, chalk.yellow("--"));
        });
        console.log("Note added successfully ✅");

        console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
      } else {
        spinner.fail("Error");
        err.map((item) => {
          console.error(chalk.redBright("Error : ", item.error));
        });
      }
    }, 1000);
  });

program
  .command("ls-notes")
  .option("-s --sort [order]", "To sort the output", "asc")
  .option("-t --tag <tags...>", "Tags to search with")
  .option("-h --help", "Show help for ls-notes")
  .action((options) => {
    if (options.help) {
      console.log("=========================================");
      console.log("📚 Command: ls-notes");
      console.log("-----------------------------------------");
      console.log("📌 Usage:");
      console.log("  ls-notes [options]");
      console.log("");
      console.log("🔧 Options:");
      console.log(
        "  -s, --sort [order]   Sort notes (asc or desc). Default is 'asc'"
      );
      console.log("  -t, --tag <tags...>  Filter notes by one or more tags");
      console.log("");
      console.log("💡 Example:");
      console.log("  ls-notes --sort desc --tag github internship");
      console.log("=========================================");
      return;
    }
    const spinner = ora("Proccessing your request").start();
    const order = options.sort || "asc";
    const tags = options.tag || [];
    const { err, mess, res } = list_notes(tags, order);
    setTimeout(() => {
      if (err.length == 0) {
        spinner.succeed("Request proccessed");
        mess.map((item) => {
          console.log("--", item.message, "--");
        });
        res.map((item, index, array) => {
          console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
          console.log(chalk.white("Note title :"), chalk.green(item.title));
          console.log(chalk.white("Note's Id :"), chalk.green(item.id));
          if (item.bullets.length > 0) {
            console.log("Bulletins:-");
            item.bullets.map((item) => {
              console.log("->", chalk.green(item));
            });
          } else {
            console.log(chalk.yellow("--No bulletins in this note--"));
          }
          if (index == array.length - 1) {
            console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
          }
        });
      } else {
        spinner.fail("Error");
        err.map((item) => {
          console.error(chalk.redBright("Error : ", item.error));
        });
      }
    }, 1000);
  });

program
  .command("delete-note")
  .argument("[id]", "ID of the note, Use ls to see the ID of the note.")
  .option("-h --help", "Show help for delete-note")
  .action((id, options) => {
    if (options.help || !id) {
      console.log("=========================================");
      console.log("🗑️ Command: delete-note");
      console.log("-----------------------------------------");
      console.log("📌 Usage:");
      console.log("  delete-note <id>");
      console.log("");
      console.log("📝 Description:");
      console.log("  Deletes the note with the given ID.");
      console.log("  You can find the ID using the `ls-notes` command.");
      console.log("");
      console.log("💡 Example:");
      console.log("  delete-note 12");
      console.log("=========================================");
      return;
    }
    if (!id) {
      console.error("❌ Error: Note ID is required.");
      console.log(chalk.yellow("Use `delete-note -h` for help."));
      process.exit(1);
    }
    const spinner = ora("Proccessing your request").start();
    const { err, mess } = delete_note(id);
    setTimeout(() => {
      if (err.length == 0) {
        spinner.succeed("Request proccessed");
        console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
        mess.map((item) => {
          console.log("--", item.message, "--");
        });
        console.log(`Note with Id ${id} is deleted ✅`);
      } else {
        spinner.fail("Error");
        console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
        err.map((item) => {
          console.error(chalk.redBright("Error: ", item.error));
        });
      }
      console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
    }, 1000);
  });

program
  .command("add-task")
  .argument("[title]", "Title of task")
  .option("-d --description <description...>", "Description of the task")
  .option("-h --help", "Show help for add-task")
  .action((title, options) => {
    if (options.help || !title) {
      console.log("=========================================");
      console.log("📝 Command: add-task");
      console.log("-----------------------------------------");
      console.log("📌 Usage:");
      console.log("  add-task <title> [options]");
      console.log("");
      console.log("🔧 Options:");
      console.log(
        "  -d, --description <desc...>  Optional description text for the task"
      );
      console.log("");
      console.log("💡 Example:");
      console.log("  add-task `Fix bug in auth module` ");
      console.log(
        "    --description `Occurs on login` `Happens when password is incorrect`"
      );
      console.log("=========================================");
      return;
    }
    if (!title) {
      console.error("❌ Error: Title is required to add a task.");
      console.log(chalk.yellow("Use `add-task -h` for help."));
      process.exit(1);
    }
    const spinner = ora("Processing your request").start();
    const des = options.description || [];
    const { err, mess } = add_task(title, des);
    setTimeout(() => {
      if (err.length == 0) {
        spinner.succeed("Request proccessed");
        console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
        mess.map((item) => {
          console.log(chalk.yellow("--"), item.message, chalk.yellow("--"));
        });
        console.log("New task added successfully ✅");
      } else {
        spinner.fail("Error");
        console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
        err.map((item) => {
          console.error(chalk.redBright("Error : ", item.error));
        });
      }
      console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
    }, 1000);
  });

program
  .command("log-tasks")
  .option("-h --help", "Show help for log-tasks")
  .action((options) => {
    if (options.help) {
      console.log("=========================================");
      console.log("📋 Command: log-tasks");
      console.log("-----------------------------------------");
      console.log("📌 Usage:");
      console.log("  log-tasks");
      console.log("");
      console.log("📝 Description:");
      console.log(
        "  Displays all the tasks that have been logged, along with their titles, IDs, and optional descriptions."
      );
      console.log("");
      console.log("💡 Example:");
      console.log("  log-tasks");
      console.log("=========================================");
      return;
    }
    const spinner = ora("Proccessing your request").start();
    const { err, mess, res } = logging();
    setTimeout(() => {
      if (err.length == 0) {
        spinner.succeed("Request proccessed");
        console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
        mess.forEach((item) => {
          console.log("--", item.message, "--");
        });
        res.map((item, index, array) => {
          console.log("Task title :", chalk.green(item.title));
          console.log("Task Id :", chalk.green(item.id));
          if (item.description.length > 0) {
            console.log("Task notes :-");
            item.description.map((item) => {
              console.log("->", chalk.green(item));
            });
          } else {
            console.log(chalk.yellow("--This task doesn't contain description--"));
          }
          if (index === array.length - 1) {
            console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
          } else {
            console.log("");
          }
        });
      } else {
        spinner.fail("Error");
        console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
        err.forEach((item) => {
          console.error(chalk.redBright("Error : ", item.error));
        });
      }
    }, 1000);
  });

program
  .command("ls-tasks")
  .option("-h --help", "Show help or ls-tasks")
  .action((options) => {
    if (options.help) {
      console.log("=========================================");
      console.log("📋 Command: ls-tasks");
      console.log("-----------------------------------------");
      console.log("📌 Usage:");
      console.log("  ls-tasks");
      console.log("");
      console.log("📝 Description:");
      console.log(
        "  Lists all pending tasks with their titles, IDs, and optional descriptions."
      );
      console.log("");
      console.log("💡 Example:");
      console.log("  ls-tasks");
      console.log("=========================================");
      return;
    }
    const spinner = ora("Fetching tasks").start();
    const { err, mess, tasks_to_do } = list_tasks();
    setTimeout(() => {
      spinner.text = "Processing the list of tasks";
    }, 500);
    setTimeout(() => {
      if (err.length == 0) {
        spinner.succeed("Request proccessed");
        console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
        mess.forEach((item) => {
          console.log(chalk.yellow("--"), item.message, chalk.yellow("--"));
        });
        tasks_to_do.map((item, index, array) => {
          console.log("Task title :", chalk.green(item.title));
          console.log("Task Id :", chalk.green(item.id));
          if (item.description.length > 0) {
            item.description.map((item) => {
              console.log("->", chalk.green(item));
            });
          } else {
            console.log(chalk.yellow("--No description for task--"));
          }
          if (index == array.length - 1) {
            console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
          } else {
            console.log("");
          }
        });
      } else {
        spinner.fail("Error");
        console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
        err.forEach((item) => {
          console.error(chalk.redBright("Error : ",item.error));
        });
        console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
      }
    }, 1500);
  });

program
  .command("delete-task")
  .argument("[id]", "Task id")
  .option("-h --help", "Show help or ls-tasks")
  .action((id, options) => {
    if (options.help || !id) {
      console.log("=========================================");
      console.log("🗑️ Command: delete-task");
      console.log("-----------------------------------------");
      console.log("📌 Usage:");
      console.log("  delete-task <id>");
      console.log("");
      console.log("📝 Description:");
      console.log("  Deletes a task based on its ID.");
      console.log("  Use `ls-tasks` to view task IDs.");
      console.log("");
      console.log("💡 Example:");
      console.log("  delete-task 123abc");
      console.log("=========================================");
      return;
    }
    if (!id) {
      console.error("❌ Error: Id is required to delete a task.");
      console.log(chalk.yellow("Use `delete-task -h` for help."));
      process.exit(1);
    }
    const spinner = ora("Processing the request").start();
    const { err, mess } = delete_taks(id);
    setTimeout(() => {
      if (err.length == 0) {
        spinner.succeed("Request proccessed");
        console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
        mess.map((item) => {
          console.log(chalk.yellow("--"), item.message, chalk.yellow("--"));
        });
        console.log("Task deleted successfully ✅");
      } else {
        spinner.fail("Error");
        console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
        err.map((item) => {
          console.error(chalk.redBright("Error : ", item.error));
        });
      }
      console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
    }, 1000);
  });

program
  .command("task-done")
  .argument("[id]", "Task id")
  .option("-h --help", "Show help or ls-tasks")
  .action((id, options) => {
    if (options.help || !id) {
      console.log("=========================================");
      console.log("✅ Command: task-done");
      console.log("-----------------------------------------");
      console.log("📌 Usage:");
      console.log("  task-done <id>");
      console.log("");
      console.log("📝 Description:");
      console.log("  Marks the task with the given ID as complete.");
      console.log("  Use `ls-tasks` to see task IDs.");
      console.log("");
      console.log("💡 Example:");
      console.log("  task-done 12");
      console.log("=========================================");
      return;
    }
    if (!id) {
      console.error("❌ Error: Id is required to mark a task as completed.");
      console.log(chalk.yellow("Use `task-done -h` for help."));
      process.exit(1);
    }
    const spinner = ora("Processing your request").start();
    const { err, mess } = complete_task(id);
    setTimeout(() => {
      if (err.length == 0) {
        spinner.succeed("Request proccessed");
        console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
        mess.map((item) => {
          console.log(chalk.yellow("--"), item.message, chalk.yellow("--"));
        });
        console.log(`Task (Id:${id}) marked as complete ✅`);
      } else {
        spinner.fail("Error");
        console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
        err.map((item) => {
          console.error(chalk.redBright("Error : ", item.error));
        });
      }
      console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
    }, 1000);
  });

program
  .command("set-reminder")
  .description("Set a reminder that notifies after given time")
  .argument("<message>", "Reminder message")
  .option("--after <duration>", "When to remind (e.g., 10m, 2h, 1d)")
  .action((message, options) => {
    const spinner = ora("Scheduling your reminder...").start();
    const rawTime = options.after;
    const duration = ms(rawTime);

    if (!duration || duration > ms("2d")) {
      spinner.fail("❌ Invalid duration. Max allowed: 2 days.");
      console.log("Examples: --after 10m, --after 2h");
      return;
    }

    const fireTime = Date.now() + duration;

    const { err, mess } = add_reminder(message, fireTime);
    if (err.length > 0) {
      spinner.fail("Error saving reminder.");
      err.forEach((e) => console.error("Error:", e.error));
      return;
    }

    spinner.succeed(`Reminder set! Will notify in ${rawTime}.`);
    mess.forEach((m) => console.log("--", m.message, "--"));

    schedule_reminder(message, duration);
  });

program
  .command("view-reminders")
  .description("View all reminders")
  .option("-h --help", "Show help for view-reminders")
  .action((options) => {
    if (options.help) {
      console.log("=========================================");
      console.log("⏰ Command: view-reminders");
      console.log("-----------------------------------------");
      console.log("📌 Usage:");
      console.log("  view-reminders");
      console.log("");
      console.log("📝 Description:");
      console.log("  Shows all reminders, with pending reminders listed first");
      console.log("  followed by completed ones.");
      console.log("");
      console.log("💡 Example:");
      console.log("  view-reminders");
      console.log("=========================================");
      return;
    }

    const spinner = ora("Fetching reminders").start();
    const { err, mess, reminders } = get_all_reminders();

    setTimeout(() => {
      if (err.length === 0) {
        spinner.succeed("Request processed");
        console.log("~~~~~~~~~~~~~~~~~~~~~~~");

        if (reminders.length === 0) {
          console.log("No reminders found");
          console.log("~~~~~~~~~~~~~~~~~~~~~~~");
          return;
        }

        let currentStatus = null;
        reminders.forEach((reminder, index) => {
          // Add a separator when status changes
          if (currentStatus !== reminder.status) {
            if (currentStatus !== null) {
              console.log("~~~~~~~~~~~~~~~~~~~~~~~");
            }
            currentStatus = reminder.status;
            console.log(`📋 ${currentStatus.toUpperCase()} REMINDERS:`);
            console.log("~~~~~~~~~~~~~~~~~~~~~~~");
          }

          const reminderTime = new Date(reminder.time);
          const timeStr = reminderTime.toLocaleString();

          console.log(`ID: ${reminder.id}`);
          console.log(`Message: ${reminder.message}`);
          console.log(`Set for: ${timeStr}`);
          console.log(`Set on: ${reminder.date} at ${reminder.setTime}`);

          if (reminder.status === "completed") {
            console.log(
              `Completed at: ${new Date(reminder.completedAt).toLocaleString()}`
            );
          }

          if (index < reminders.length - 1) {
            console.log("-------------------");
          }
        });
        console.log("~~~~~~~~~~~~~~~~~~~~~~~");
      } else {
        spinner.fail("Error");
        console.log("~~~~~~~~~~~~~~~~~~~~~~~");
        err.forEach((item) => {
          console.error("Error:", item.error);
        });
        console.log("~~~~~~~~~~~~~~~~~~~~~~~");
      }
    }, 1000);
  });

program
  .command("delete-reminder")
  .description("Delete a reminder by its ID")
  .argument(
    "[id]",
    "ID of the reminder to delete. Use 'view-reminders' to find the ID."
  )
  .option("-h --help", "Show help for delete-reminder")
  .action((id, options) => {
    if (options.help || !id) {
      console.log("=========================================");
      console.log("🗑️ Command: delete-reminder");
      console.log("-----------------------------------------");
      console.log("📌 Usage:");
      console.log("  delete-reminder <id>");
      console.log("");
      console.log("📝 Description:");
      console.log("  Deletes the reminder with the specified ID.");
      console.log("  You can find the ID using the `view-reminders` command.");
      console.log("");
      console.log("💡 Example:");
      console.log("  delete-reminder 3");
      console.log("=========================================");
      return;
    }

    if (!id) {
      console.error("❌ Error: Reminder ID is required.");
      console.log("Use `delete-reminder -h` for help.");
      process.exit(1);
    }

    const spinner = ora("Processing your request").start();
    const { err, mess } = delete_reminder(id);

    setTimeout(() => {
      if (err.length === 0) {
        spinner.succeed("Request processed");
        console.log("~~~~~~~~~~~~~~~~~~~~~~~");
        mess.forEach((item) => {
          console.log("--", item.message, "--");
        });
        console.log(`Reminder deleted successfully ✅`);
      } else {
        spinner.fail("Error");
        console.log("~~~~~~~~~~~~~~~~~~~~~~~");
        err.forEach((item) => {
          console.error("Error:", item.error);
        });
      }
      console.log("~~~~~~~~~~~~~~~~~~~~~~~");
    }, 1000);
  });

program.parse();
