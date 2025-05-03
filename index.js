#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const ora = require('ora').default;
const {addNote, list_notes, delete_note} = require("./utils/notes-utility");
const { add_task, logging, list_tasks, delete_taks, complete_task } = require('./utils/task-untility');


const program = new Command();

program
    .name("mycli")
    .description("CLI tool to manage notes and tasks")
    .version("1.0.0")

program
    .command("add-note")
    .description('Adding a new note')
    .argument('<title>', 'Title')
    .option('-n --note <notes...>', 'Notes')
    .option('-t --tags <tags...>', 'Tags associated with a note')
    .action((title, options) =>{
        const spinner = ora("Proccessing your request");
        const notes = options.note || [];
        const tags = options.tags || [];
        const result = addNote(title, notes, tags);
        spinner.succeed("Proccessed your request");
        console.log("Added a note from index");
    })

program
    .command("ls-note")
    .option('-s --sort [order]', 'To sort the output', 'asc')
    .option('-t --tag <tags...>', 'Tags to search with')
    .action((options)=>{
        const spinner = ora("Proccessing your request");
        const order = options.sort || "asc";
        const tags = options.tag || [];
        const {err, mess, res} = list_notes(tags, order);
        setTimeout(() => {
            if(err.length == 0){
                const spinner = ora("Processing your request");
                mess.map(item=>{
                    console.log(item.message);
                })
                console.log(res);
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
    .argument('<id>', 'ID of the note, Use ls to see the ID of the note.')
    .action((id)=>{
        const spinner = ora("Proccessing your request");
        const {err, mess} = delete_note(id);
        setTimeout(() => {
            if(err.length ==0){
                spinner.succeed("Request proccessed");
                mess.map(item=>{
                    console.log(item.message);
                })
            }
            else{
                spinner.fail("Error");
                err.map(item=>{
                    console.error("Error: ", item.error);
                })
            }
        }, 1000);
    })

program
    .command("add-task")
    .argument('<title>', 'Title of task')
    .option('-d --description <description...>', 'Description of the task')
    .action((title, options)=>{
        const spinner = ora("Processing your request");
        const des = options.description || []
        const {err, mess} = add_task(title, options);
        setTimeout(() => {
            if(err.length == 0){
                spinner.succeed("Request proccessed");
                mess.map((item) => {
                  console.log(item.message);
                });
            }
            else{
                spinner.fail("Error");
                err.map((item)=>{
                    console.error("Error : ", item.error);
                })
            }
        }, 1000);
    })

program
    .command("log-task")
    .action(()=>{
        const spinner = ora("Proccessing your request");
        const {err, mess, res} = logging();
        setTimeout(() => {
            if(err.length == 0){
                spinner.succeed("Request proccessed");
                mess.forEach((item)=>{
                    console.log(item.message);
              })
              console.log(res);
            }
            else{
                spinner.fail("Error");
                err.forEach((item)=>{
                    console.error("Error : ", item.error);
                })
            }
        }, 1000);
    })

program
    .command("ls-task")
    .action(()=>{
        const spinner = ora("Fetching all tasks").start();
        const {err, mess, tasks_to_do} = list_tasks();
        setTimeout(() => {
            spinner.text = "Processing the list of tasks";
        }, 500);
        setTimeout(() => {
            if(err.length ==0){
                spinner.fail("Error");
                mess.forEach((item)=>{
                    console.log(item.message);
                })
                console.log(tasks_to_do);
            }
            else{
                spinner.succeed("Request proccessed");
                err.forEach((item)=>{
                    console.error(item.error);
                })
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
                mess.map((item)=>{
                    console.log(item.message);
                })
            }
            else{
                spinner.fail("Error");
                err.map((item)=>{
                    console.error("Error : ", item.error);
                })
            }
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
                spinner.fail("Error");
                mess.map((item)=>{
                    console.log(item.message);
                })
            }
            else{
                spinner.succeed("Request proccessed")
                err.map((item)=>{
                    console.error("Error : ", item.error);
                })
            }
        }, 1000);
    })

program.parse();
