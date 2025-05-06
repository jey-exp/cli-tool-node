#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const ora = require('ora').default;
const {addNote, list_notes, delete_note} = require("./utils/notes-utility");
const { add_task, logging, list_tasks, delete_taks, complete_task } = require('./utils/task-utility');


const program = new Command();

program
    .name("mycli")
    .description("CLI tool to manage notes and tasks")
    .version("1.0.0")

program
    .command("add-note")
    .description('Adding a new note')
    .argument('[title]', 'Title')
    .option('-b --bullets <bullets...>', 'Notes')
    .option('-t --tags <tags...>', 'Tags associated with a note')
    .option('-h --help', 'Show help for add-note')
    .action((title, options) =>{
        if(options.help | !title){
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
            console.log("    --bullets `GitHub is not willing to continue octernships` ");
            console.log("              `Maybe it can be resumed a year later` ");
            console.log("    --tags `github` `octernship` `internship`");
            console.log("=========================================");
            return;
        }
        if (!title) {
            console.error("❌ Error: Title is required to add a note.");
            console.log("Use `add-note -h` for usage info.");
            process.exit(1);
        }
        const spinner = ora("Proccessing your request").start();
        const bullets = options.bullets || [];
        const tags = options.tags || [];
        const {err, mess} = addNote(title, bullets, tags);
        setTimeout(() => {
            if(err.length == 0){
                spinner.succeed("Request proccessed");
                console.log("~~~~~~~~~~~~~~~~~~~~~~~");
                mess.map(item=>{
                    console.log("--",item.message,"--");
                })
                console.log("Note added successfully ✅");
                
                console.log("~~~~~~~~~~~~~~~~~~~~~~~");
            }
            else{
                spinner.fail("Error");
                err.map((item)=>{
                    console.error("Error : ", item.error)
                })
            }
        }, 1000);
    })

program
    .command("ls-notes")
    .option('-s --sort [order]', 'To sort the output', 'asc')
    .option('-t --tag <tags...>', 'Tags to search with')
    .option('-h --help', 'Show help for ls-notes')
    .action((options)=>{
        if (options.help) {
            console.log("=========================================");
            console.log("📚 Command: ls-notes");
            console.log("-----------------------------------------");
            console.log("📌 Usage:");
            console.log("  ls-notes [options]");
            console.log("");
            console.log("🔧 Options:");
            console.log("  -s, --sort [order]   Sort notes (asc or desc). Default is 'asc'");
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
        const {err, mess, res} = list_notes(tags, order);
        setTimeout(() => {
            if(err.length == 0){
                spinner.succeed("Request proccessed");
                mess.map(item=>{
                    console.log("--",item.message, "--");
                })
                res.map((item, index, array)=>{
                    console.log("~~~~~~~~~~~~~~~~~~~~~~~");
                    console.log("Note title :", item.title);
                    console.log("Note's Id :", item.id);
                    
                    if(item.bullets.length > 0){
                        console.log("Bulletins:-");
                        item.bullets.map((item)=>{
                            console.log("->",item);
                        })
                    }
                    else{
                        console.log("--No bulletins in this note--");
                    }
                    if(index == array.length -1){
                        console.log("~~~~~~~~~~~~~~~~~~~~~~~");
                    }
                })
            }
            else{
                spinner.fail("Error");
                err.map((item)=>{
                    console.error("Error : ", item.error)
                })
            }
        }, 1000);
    })

program
    .command("delete-note")
    .argument('[id]', 'ID of the note, Use ls to see the ID of the note.')
    .option('-h --help', 'Show help for delete-note')
    .action((id, options)=>{
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
            console.log("Use `delete-note -h` for help.");
            process.exit(1);
        }
        const spinner = ora("Proccessing your request").start();
        const {err, mess} = delete_note(id);
        setTimeout(() => {
            if(err.length ==0){
                spinner.succeed("Request proccessed");
                console.log("~~~~~~~~~~~~~~~~~~~~~~~");
                mess.map(item=>{
                    console.log("--",item.message,"--");
                })
                console.log(`Note with Id ${id} is deleted ✅`);
                
            }
            else{
                spinner.fail("Error");
                console.log("~~~~~~~~~~~~~~~~~~~~~~~");
                err.map(item=>{
                    console.error("Error: ", item.error);
                })
            }
            console.log("~~~~~~~~~~~~~~~~~~~~~~~");
        }, 1000);
    })

program
    .command("add-task")
    .argument('<title>', 'Title of task')
    .option('-d --description <description...>', 'Description of the task')
    .action((title, options)=>{
        const spinner = ora("Processing your request").start();
        const des = options.description || []
        const {err, mess} = add_task(title, des);
        setTimeout(() => {
            if(err.length == 0){
                spinner.succeed("Request proccessed");
                console.log("~~~~~~~~~~~~~~~~~~~~~~~");
                mess.map((item) => {
                  console.log("--",item.message,"--");
                });
                console.log("New task added successfully ✅");
                
            }
            else{
                spinner.fail("Error");
                console.log("~~~~~~~~~~~~~~~~~~~~~~~");
                err.map((item)=>{
                    console.error("Error : ", item.error);
                })
            }
            console.log("~~~~~~~~~~~~~~~~~~~~~~~");
        }, 1000);
    })

program
    .command("log-tasks")
    .action(()=>{
        const spinner = ora("Proccessing your request").start();
        const {err, mess, res} = logging();
        setTimeout(() => {
            if(err.length == 0){
                spinner.succeed("Request proccessed");
                console.log("~~~~~~~~~~~~~~~~~~~~~~~");
                mess.forEach((item)=>{
                    console.log("--",item.message,"--");
              })
              res.map((item, index, array)=>{
                console.log("Task title :", item.title);
                console.log("Task Id :", item.id);
                if(item.description.length > 0){
                    console.log("Task notes :-");
                    item.description.map((item)=>{
                        console.log("->",item);
                    })
                }
                else{
                    console.log("--No description for this task--");
                }
                if(index === array.length -1){
                    console.log("~~~~~~~~~~~~~~~~~~~~~~~");
                }
                else{
                    console.log("");
                }
              })
            }
            else{
                spinner.fail("Error");
                console.log("~~~~~~~~~~~~~~~~~~~~~~~");
                err.forEach((item)=>{
                    console.error("Error : ", item.error);
                })
            }
        }, 1000);
    })

program
    .command("ls-tasks")
    .action(()=>{
        const spinner = ora("Fetching tasks").start();
        const {err, mess, tasks_to_do} = list_tasks();
        setTimeout(() => {
            spinner.text = "Processing the list of tasks";
        }, 500);
        setTimeout(() => {
            if(err.length ==0){
                spinner.succeed("Request proccessed");
                console.log("~~~~~~~~~~~~~~~~~~~~~~~");
                mess.forEach((item)=>{
                    console.log("--",item.message,"--");
                })
                tasks_to_do.map((item, index, array)=>{
                    console.log("Task title :", item.title);
                    console.log("Task Id :", item.id);
                    if(item.description.length > 0){
                        item.description.map((item)=>{
                            console.log("->", item);
                        })
                    }
                    else{
                        console.log("--No description for task--");
                    }
                    if(index == array.length -1){
                        console.log("~~~~~~~~~~~~~~~~~~~~~~~");
                    }
                    else{
                        console.log("");
                        
                    }
                })
            }
            else{
                spinner.fail("Error");
                console.log("~~~~~~~~~~~~~~~~~~~~~~~");
                err.forEach((item)=>{
                    console.error(item.error);
                })
                console.log("~~~~~~~~~~~~~~~~~~~~~~~");
            }
        }, 1500);
    })

program
    .command("delete-task")
    .argument('<id>', 'Task id')
    .action((id)=>{
        const spinner = ora("Processing the request").start();
        const{err, mess} = delete_taks(id);
        setTimeout(() => {
            if(err.length==0){
                spinner.succeed("Request proccessed");
                console.log("~~~~~~~~~~~~~~~~~~~~~~~");
                mess.map((item)=>{
                    console.log("--",item.message,"--");
                })
                console.log("Task deleted successfully ✅");
            }
            else{
                spinner.fail("Error");
                console.log("~~~~~~~~~~~~~~~~~~~~~~~");
                err.map((item)=>{
                    console.error("Error : ", item.error);
                })
            }
            console.log("~~~~~~~~~~~~~~~~~~~~~~~");
        }, 1000);
    })

program
    .command("task-done")
    .argument('<id>', 'Task id')
    .action((id)=>{
        const spinner = ora("Processing your request").start();
        const {err, mess} = complete_task(id);
        setTimeout(() => {
            if(err.length==0){
                spinner.succeed("Request proccessed");
                console.log("~~~~~~~~~~~~~~~~~~~~~~~");
                mess.map((item)=>{
                    console.log("--",item.message,"--");
                })
                console.log(`Task (Id:${id}) marked as complete ✅`);
                
            }
            else{
                spinner.fail("Error");
                console.log("~~~~~~~~~~~~~~~~~~~~~~~");
                err.map((item)=>{
                    console.error("Error : ", item.error);
                })
            }
            console.log("~~~~~~~~~~~~~~~~~~~~~~~");
        }, 1000);
    })

program.parse();
