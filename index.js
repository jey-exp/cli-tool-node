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
  .description(chalk.yellowBright("CLI tool to manage notes and tasks"))
  .version("1.0.0");

program
  .command("add-note")
  .description(chalk.green("Add a new note"))
  .argument("[title]", "Title")
  .option("-b --bullets <bullets...>", "Notes")
  .option("-t --tags <tags...>", "Tags associated with a note")
  .option("-h --help", "Show help for add-note")
  .action((title, options) => {
    if (options.help) {
      console.log("=========================================");
      console.log(chalk.yellowBright("📝 Command: "), "add-note");
      console.log(chalk.gray("-----------------------------------------"));
      console.log(chalk.green("📌 Usage:"));
      console.log("  add-note <title> [options]");
      console.log(chalk.cyan("          (`title` is required)"));
      console.log("");
      console.log(chalk.green("🔧 Options:"));
      console.log("  -b, --bullets     Add bullet points under the note");
      console.log(chalk.cyan("                    (Accepts multiple bullet points)"));
      console.log(chalk.cyan("                    (Alteast one bullet point is required)"));
      console.log("  -t, --tags        Add one or more tags to the note");
      console.log(chalk.cyan("                    (Accepts multiple tags)"));
      console.log(chalk.cyan("                    (Atleast one tag is required)"));
      console.log("");
      console.log(chalk.green("💡 Example:"));
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
      console.log(chalk.yellow("Use `add-note --help` for usage info."));
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
  .description(chalk.green("List all notes."))
  .option("-s --sort [order]", "To sort the output", "asc")
  .option("-t --tag <tags...>", "Tags to search with")
  .option("-h --help", "Show help for ls-notes")
  .action((options) => {
    if (options.help) {
      console.log("=========================================");
      console.log(chalk.yellowBright("📚 Command: "),"ls-notes");
      console.log("-----------------------------------------");
      console.log(chalk.green("📌 Usage:"));
      console.log("  ls-notes [options]");
      console.log("");
      console.log(chalk.green("🔧 Options:"));
      console.log(
        "  -s, --sort [order]   Sort notes (asc or desc). Default is 'asc'"
      );
      console.log("  -t, --tag <tags...>  Filter notes by one or more tags");
      console.log(chalk.cyan("      (Accepts multiple tags)"));
      console.log(chalk.cyan("      (Atleast one tag is required)"));
      console.log("");
      console.log(chalk.green("💡 Example:"));
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
          console.log(chalk.yellow("--"), item.message, chalk.yellow("--"));
        });
        res.map((item, index, array) => {
          console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
          console.log("Note title :", chalk.green(item.title));
          console.log("Note's Id :", chalk.green(item.id));
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
  .description(chalk.redBright("Delete a note by its ID"))
  .argument("[id]", "ID of the note, Use ls to see the ID of the note.")
  .option("-h --help", "Show help for delete-note")
  .action((id, options) => {
    if (options.help) {
      console.log("=========================================");
      console.log(chalk.yellowBright("🗑️ Command: "),"delete-note");
      console.log("-----------------------------------------");
      console.log(chalk.green("📌 Usage:"));
      console.log("  delete-note <id>");
      console.log(chalk.cyan("              (note's id is required)"));
      console.log("");
      console.log(chalk.green("📝 Description:"));
      console.log("  Deletes the note with the given ID.");
      console.log("  You can find the ID using the `ls-notes` command.");
      console.log("");
      console.log(chalk.green("💡 Example:"));
      console.log("  delete-note 12");
      console.log("=========================================");
      return;
    }
    if (!id) {
      console.error("❌ Error: Note ID is required.");
      console.log(chalk.yellow("Use `delete-note --help` for help."));
      process.exit(1);
    }
    const spinner = ora("Proccessing your request").start();
    const { err, mess } = delete_note(id);
    setTimeout(() => {
      if (err.length == 0) {
        spinner.succeed("Request proccessed");
        console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
        mess.map((item) => {
          console.log(chalk.yellow("--"), item.message, chalk.yellow("--"));
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
  .description(chalk.green("Add a new task"))
  .argument("[title]", "Title of task")
  .option("-d --description <description...>", "Description of the task")
  .option("-h --help", "Show help for add-task")
  .action((title, options) => {
    if (options.help) {
      console.log("=========================================");
      console.log(chalk.yellowBright("📝 Command: "),"add-task");
      console.log("-----------------------------------------");
      console.log(chalk.green("📌 Usage:"));
      console.log("  add-task <title> [options]");
      console.log(chalk.cyan("           (title is required)"));
      console.log("");
      console.log(chalk.green("🔧 Options:"));
      console.log(
        "  -d, --description <desc...>  Optional description text for the task"
      );
      console.log(chalk.cyan("        (description accepts multiple points)"));
      console.log(chalk.cyan("        (atleast one description is required)"));
      console.log("");
      console.log(chalk.green("💡 Example:"));
      console.log("  add-task `Fix bug in auth module` ");
      console.log(
        "    --description `Occurs on login` `Happens when password is incorrect`"
      );
      console.log("=========================================");
      return;
    }
    if (!title) {
      console.error("❌ Error: Title is required to add a task.");
      console.log(chalk.yellow("Use `add-task --help` for help."));
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
  .description(chalk.green("See history of tasks."))
  .option("-h --help", "Show help for log-tasks")
  .action((options) => {
    if (options.help) {
      console.log("=========================================");
      console.log(chalk.yellowBright("📋 Command: "),"log-tasks");
      console.log("-----------------------------------------");
      console.log(chalk.green("📌 Usage:"));
      console.log("  log-tasks");
      console.log("");
      console.log(chalk.green("📝 Description:"));
      console.log(
        "  Displays all the tasks that have been logged, along with their titles, IDs, and optional descriptions."
      );
      console.log("");
      console.log(chalk.green("💡 Example:"));
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
          console.log(chalk.yellow("--"), item.message, chalk.yellow("--"));
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
  .description(chalk.green("List all pending tasks."))
  .option("-h --help", "Show help or ls-tasks")
  .action((options) => {
    if (options.help) {
      console.log("=========================================");
      console.log(chalk.yellowBright("📋 Command: "),"ls-tasks");
      console.log("-----------------------------------------");
      console.log(chalk.green("📌 Usage:"));
      console.log("  ls-tasks");
      console.log("");
      console.log(chalk.green("📝 Description:"));
      console.log(
        "  Lists all pending tasks with their titles, IDs, and optional descriptions."
      );
      console.log("");
      console.log(chalk.green("💡 Example:"));
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
  .description(chalk.redBright("Delete a task by its ID"))
  .option("-h --help", "Show help or ls-tasks")
  .action((id, options) => {
    if (options.help) {
      console.log("=========================================");
      console.log(chalk.yellowBright("🗑️ Command: "),"delete-task");
      console.log("-----------------------------------------");
      console.log(chalk.green("📌 Usage:"));
      console.log("  delete-task <id>");
      console.log(chalk.cyan("              (task's Id is required)"));
      console.log("");
      console.log(chalk.green("📝 Description:"));
      console.log("  Deletes a task based on its ID.");
      console.log("  Use `ls-tasks` to view task IDs.");
      console.log("");
      console.log(chalk.green("💡 Example:"));
      console.log("  delete-task 12");
      console.log("=========================================");
      return;
    }
    if (!id) {
      console.error("❌ Error: Id is required to delete a task.");
      console.log(chalk.yellow("Use `delete-task --help` for help."));
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
  .description(chalk.green("Mark a task as completed"))
  .argument("[id]", "Task id")
  .option("-h --help", "Show help or ls-tasks")
  .action((id, options) => {
    if (options.help) {
      console.log("=========================================");
      console.log(chalk.yellowBright("✅ Command: "),"task-done");
      console.log("-----------------------------------------");
      console.log(chalk.green("📌 Usage:"));
      console.log("  task-done <id>");
      console.log(chalk.cyan("            (task's Id is required)"));
      console.log("");
      console.log(chalk.green("📝 Description:"));
      console.log("  Marks the task with the given ID as complete.");
      console.log("  Use `ls-tasks` to see task IDs.");
      console.log("");
      console.log(chalk.green("💡 Example:"));
      console.log("  task-done 12");
      console.log("=========================================");
      return;
    }
    if (!id) {
      console.error("❌ Error: Id is required to mark a task as completed.");
      console.log(chalk.yellow("Use `task-done --help` for help."));
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
  .description(chalk.green("Set a reminder that notifies after given time"))
  .argument("[message]", "Reminder message")
  .option("--after [duration]", "When to remind (e.g., 10m, 2h, 1d)")
  .option("-h --help", "Show help for set-reminder")
  .action((message, options) => {
    if(options.help){
      console.log("=========================================");
      console.log(chalk.yellowBright("✅ Command: "),"set-reminder");
      console.log("-----------------------------------------");
      console.log(chalk.green("📌 Usage:"));
      console.log("  set-reminder <message> --after <duration>");
      console.log(chalk.cyan("               (message and duration are required)"));
      console.log("");
      console.log(chalk.green("📝 Description:"));
      console.log("  Adds a new reminder after specified time.");
      console.log("");
      console.log(chalk.green("💡 Example:"));
      console.log("  set-reminder `Meeting with team` --after 10m");
      console.log("=========================================");
      return;
    }
    if(!message && (!options.after || options.after === true)) {
      console.error("❌ Error: message, duration is required to add a reminder");
      console.log(chalk.yellow("Use `set-reminder --help` for help."));
      process.exit(1);
    }
    else if(!message){
      console.error("❌ Error: message is required to add a reminder");
      console.log(chalk.yellow("Use `set-reminder --help` for help."));
      process.exit(1);
    }
    else if(!options.after || options.after === true){
      console.error("❌ Error: duration is required to add a reminder");
      console.log(chalk.yellow("Use `set-reminder --help` for help."));
      process.exit(1);
    }
    const spinner = ora("Scheduling your reminder...").start();
    const rawTime = options.after;
    const duration = ms(rawTime);
    
    if (!duration || duration > ms("2d")) {
      spinner.fail("❌ Invalid duration. Max allowed: 2 days.");
      console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
      console.log(chalk.yellow("Examples: --after 10m, --after 2h"));
      console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
      return;
    }

    const fireTime = Date.now() + duration;

    const { err, mess } = add_reminder(message, fireTime);
    if (err.length > 0) {
      spinner.fail("Error adding reminder.");
      console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
      err.forEach((e) => console.error(chalk.redBright("Error:", e.error)));
      console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
      return;
    }

    spinner.succeed(`Reminder set✅ Will notify in ${rawTime}.`);
    console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
    mess.forEach((m) => console.log(chalk.yellow("--"), m.message, chalk.yellow("--")));
    console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));

    schedule_reminder(message, duration);
  });

program
  .command("view-reminders")
  .description(chalk.green("View all reminders"))
  .option("-h --help", "Show help for view-reminders")
  .action((options) => {
    if (options.help) {
      console.log("=========================================");
      console.log(chalk.yellowBright("⏰ Command: "),"view-reminders");
      console.log("-----------------------------------------");
      console.log(chalk.green("📌 Usage:"));
      console.log("  view-reminders");
      console.log("");
      console.log(chalk.green("📝 Description:"));
      console.log("  Shows all reminders, with pending reminders listed first");
      console.log("  followed by completed ones.");
      console.log("");
      console.log(chalk.green("💡 Example:"));
      console.log("  view-reminders");
      console.log("=========================================");
      return;
    }

    const spinner = ora("Fetching reminders").start();
    const { err, mess, reminders } = get_all_reminders();

    setTimeout(() => {
      if (err.length === 0) {
        spinner.succeed("Request processed");
        console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));

        if (reminders.length === 0) {
          console.log(chalk.yellow("No reminders found"));
          console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
          return;
        }

        let currentStatus = null;
        reminders.forEach((reminder, index) => {
          // Add a separator when status changes
          if (currentStatus !== reminder.status) {
              console.log(chalk.yellow("~~~~~~~~~~~~~~~~~~~~~~~"));
            currentStatus = reminder.status;
            console.log(`📋 ${currentStatus.toUpperCase()} REMINDERS:`);
            console.log(chalk.yellow("~~~~~~~~~~~~~~~~~~~~~~~"));
          }

          const reminderTime = new Date(reminder.time);
          const timeStr = reminderTime.toLocaleString();

          console.log(`ID: ${chalk.green(reminder.id)}`);
          console.log(`Message: ${chalk.green(reminder.message)}`);
          console.log(`Set for: ${chalk.green(timeStr)}`);
          console.log(`Set on: ${chalk.green(reminder.date)} at ${chalk.green(reminder.setTime)}`);

          if (reminder.status === "completed") {
            console.log(
              `Completed at: ${new Date(reminder.completedAt).toLocaleString()}`
            );
          }

          if (index < reminders.length - 1) {
            console.log(chalk.gray("----------------------------------"));
          }
        });
        console.log("~~~~~~~~~~~~~~~~~~~~~~~");
      } else {
        spinner.fail("Error");
        console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
        err.forEach((item) => {
          console.error(chalk.redBright("Error:", item.error));
        });
        console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
      }
    }, 1000);
  });

program
  .command("delete-reminder")
  .description(chalk.redBright("Delete a reminder by its Id"))
  .argument(
    "[id]",
    "ID of the reminder to delete. Use 'view-reminders' to find the ID."
  )
  .option("-h --help", "Show help for delete-reminder")
  .action((id, options) => {
    if (options.help) {
      console.log("=========================================");
      console.log(chalk.yellowBright("🗑️ Command: delete-reminder"));
      console.log("-----------------------------------------");
      console.log(chalk.green("📌 Usage:"));
      console.log("  delete-reminder <id>");
      console.log(chalk.cyan("                  (reminder's Id is required)"));
      console.log("");
      console.log(chalk.green("📝 Description:"));
      console.log("  Deletes the reminder with the specified ID.");
      console.log("  You can find the ID using the `view-reminders` command.");
      console.log("");
      console.log(chalk.green("💡 Example:"));
      console.log("  delete-reminder 3");
      console.log("=========================================");
      return;
    }

    if (!id) {
      console.error("❌ Error: Reminder ID is required.");
      console.log(chalk.yellow("Use `delete-reminder --help` for help."));
      process.exit(1);
    }

    const spinner = ora("Processing your request").start();
    const { err, mess } = delete_reminder(id);

    setTimeout(() => {
      if (err.length === 0) {
        spinner.succeed("Request processed");
        console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
        mess.forEach((item) => {
          console.log(chalk.yellow("--"), item.message, chalk.yellow("--"));
        });
        console.log(`Reminder deleted successfully ✅`);
      } else {
        spinner.fail("Error");
        console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
        err.forEach((item) => {
          console.error(chalk.redBright("Error:", item.error));
        });
      }
      console.log(chalk.gray("~~~~~~~~~~~~~~~~~~~~~~~"));
    }, 1000);
  });

program.parse();
