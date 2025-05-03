const fs = require("fs");
const path = require("path");


const filePath = path.join(__dirname, "../tasks.json");

const readFile = ()=>{
    const file_content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(file_content);
}

const writeFile = (content) =>{
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    return;
}

const add_task = (title, des)=>{
    const err =[];
    const mess = [];
    try {
        if(des === ""){
            mess.push({message: "No description is provided"});
        }
        const file_content = readFile();
        const task = {
            title : title,
            description : des,
            status: "on-going",
            id : file_content.length + 1,
            date : new Date().toISOString().split('T')[0],
            time : new Date().toLocaleTimeString()
        }
        file_content.push(task);
        writeFile(file_content);
        mess.push({message:`Task addedd`});
        mess.push({message:` Task id : ${task.id}`});
        return {err, mess};
    } catch (error) {
        err.push({error:error});
        return {err, mess};
    }
}

const list_tasks = ()=>{
    const err =[];
    const mess =[];
    try {
        const file_content = readFile();
        const tasks_to_do = file_content.filter(item=>item.status === "on-going" || item.status === "draft");
        if(tasks_to_do.length === 0){
            mess.push({message : "No tasks pending"});
        }
        return {err, mess, tasks_to_do};
    } catch (error) {
        err.push({error:error});
        return {err, mess};
    }
}

const logging = ()=>{
    const err =[];
    const mess =[];
    try {
        const file_content = readFile();
        const res = file_content.filter(item=> item.status === "done" );
        if(res.length === 0){
            mess.push({message:"No task history found"});
        }
        return {err, mess, res};
    } catch (error) {
        err.push({error:error});
        return {err, mess};
    }
}

const delete_taks = (id)=>{
    const err =[];
    const mess =[];
    try {
        const file_content = readFile();
        var flag =0;
        file_content.forEach((item)=>{
            if(item.id == id){
                mess.push({message:`Task with id ${id} found!`})
                if(item.status === "deleted"){
                    mess.push({message : "Task already deleted"});
                    flag = 1;
                }
                else{
                    item.status = "deleted";
                }
                return;
            }
        })
        if(mess.length == 0){
            err.push({error:`No task with ID ${id}`})
        }
        else if(flag==0){
            writeFile(file_content);
            mess.push({message:`Deleted task with ID ${id}`});
        }
        return {err, mess};
    } catch (error) {
        err.push({error:error});
        return {err, mess};
    }
}

const complete_task = (id)=>{
    const err =[];
    const mess =[];
    try {
        const file_content = readFile();
        var flag =0;
        file_content.forEach((item)=>{
            if(item.id == id){
                mess.push({message:`Task with Id ${id} found`});
                if(item.status === "done"){
                    mess.push({message:`Task with Id ${id} is already completed`});
                    flag =1;
                }
                else{
                    item.status = "done";
                }
                return;
            }
        })
        if(mess.length === 0){
            err.push({error : `No task with Id ${id}`});
        }
        else if(flag==0){
            writeFile(file_content);
            mess.push({message : "Task Completed"});
        }
        return {err, mess};
    } catch (error) {
        err.push({error:error});
        return {err, mess};
    }
}

module.exports = {add_task, list_tasks, delete_taks, complete_task, logging};