#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const ora = require('ora').default;
const {addNote, list_notes, delete_note} = require("./utils/notes-utility");
const { add_task, logging, list_tasks, delete_taks, complete_task } = require('./utils/task-untility');


const program = new Command();

program
    .name("allinone")
    .description("CLI tool to manage notes and tasks")
    .version("1.0.0")

program
    .command("add-note")
    .description('Adding a new note')
    .argument('<title>', 'Title')
    .option('-n --note <notes...>', 'Notes')
    .option('-t --tags <tags...>', 'Tags associated with a note')
    .action((title, options) =>{
        const notes = options.note || [];
        const tags = options.tags || [];
        const spinner = ora('Adding note...').start();
        const result = addNote(title, notes, tags);
        spinner.succeed(`Added:${title}`);
        console.log("Added a note from index");
    })

program
    .command("ls-note")
    .option('-s --sort [order]', 'To sort the output', 'asc')
    .option('-t --tag <tags...>', 'Tags to search with')
    .action((options)=>{
        const order = options.sort || "asc";
        const tags = options.tag || [];
        const {err, mess, res} = list_notes(tags, order);
        if(err.length == 0){
            mess.map(item=>{
                console.log(item.message);
            })
            console.log(res);
        }
        else{
            err.map((item)=>{
                console.error("Error : ", item.error)
            })
        }
    })

program
    .command("delete-note")
    .argument('<id>', 'ID of the note, Use ls to see the ID of the note.')
    .action((id)=>{
        const {error, message} = delete_note(id);
        if(error.length ==0){
            message.map(item=>{
                console.log(item.message);
            })
        }
        else{
            error.map(item=>{
                console.error("Error: ", item.error);
            })
        }
    })

program
    .command("add-task")
    .argument('<title>', 'Title of task')
    .option('-d --description <description...>', 'Description of the task')
    .action((title, options)=>{
        const des = options.description || []
        const {err, mess} = add_task(title, options);
        if(err.length == 0){
            mess.map((item) => {
              console.log(item.message);
            });
        }
        else{
            err.map((item)=>{
                console.error("Error : ", item.error);
            })
        }
    })

program
    .command("log-task")
    .action(()=>{
        const {err, mess, res} = logging();
        if(err.length == 0){
            mess.forEach((item)=>{
                console.log(item.message);
          })
          console.log(res);
        }
        else{
            err.forEach((item)=>{
                console.error("Error : ", item.error);
            })
        }
    })

program
    .command("ls-task")
    .action(()=>{
        const {err, mess, tasks_to_do} = list_tasks();
        if(err.length ==0){
            mess.forEach((item)=>{
                console.log(item.message);
            })
            console.log(tasks_to_do);
        }
        else{
            err.forEach((item)=>{
                console.error(item.error);
            })
        }
    })

program
    .command("delete-task")
    .argument('<id>', 'Task id')
    .action((id)=>{
        const{err, mess} = delete_taks(id);
        if(err.length==0){
            mess.map((item)=>{
                console.log(item.message);
            })
        }
        else{
            err.map((item)=>{
                console.error("Error : ", item.error);
            })
        }
    })

program
    .command("task-done")
    .argument('<id>', 'Task id')
    .action((id)=>{
        const {err, mess} = complete_task(id);
        if(err.length==0){
            mess.map((item)=>{
                console.log(item.message);
            })
        }
        else{
            err.map((item)=>{
                console.error("Error : ", item.error);
            })
        }
    })

program.parse();
