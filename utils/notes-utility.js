const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../notes.json");

const readFile = ()=>{
    if(!fs.existsSync(filePath)){
        console.error("File not found");
        return [];
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
}

const writeFile = (content) =>{
    if(!fs.existsSync(filePath)){
        console.error("File not found");
        return [];
    }
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
}

const addNote = (title, notes, tags)=>{
    console.log("Adding note bro...");
    console.log("title : ", title);
    console.log("notes :", notes);
    console.log("tags :", tags);
    
    try {
        const file_content = readFile();
        const new_note = {
            title : title,
            notes : notes,
            tags : tags,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString(),
            id : file_content.length +1,
            status : "live"
        }
        file_content.push(new_note);
        writeFile(file_content);
    } catch (error) {
        console.error("Error in adding : ", error);
    }
}

const list_notes = (tags, sort) =>{
    const file_content = readFile();
    const err =[];
    const mess =[];
    var res = file_content.filter((item)=>item.status === "live");
    try {
        if(file_content.length == 0){
            err.push({error : "No notes to display"});
            return {err, mess};
        }
        if(tags && tags.length > 0){
            res = res.filter((item)=> tags.length === 0 || tags.some((i)=> item.tags.includes(i)));
            mess.push({message:"Filtered with tags"});
        }
        if(sort){
            res.sort((a, b)=>{
                const date1 = new Date(`${a.date}T${a.time}`);
                const date2 = new Date(`${b.date}T${b.time}`);
                return sort === "desc" ? date2-date1 : date1-date2
            })
            mess.push({message:`Sorted in ${sort === "desc" ? sort : "asc"} order`});
            return {err, mess, res};
        }
        else{
            return {err, mess, res};
        }
        
    } catch (error) {
        err.push({error : error});
        return {err, mess};
    }
}

const delete_note = (id)=>{
    const file_content = readFile();
    const err =[];
    const mess = []
    try {
        file_content.forEach((element) => {
            if (element.id == id ) {
                if(element.status==="deleted"){
                    err.push({error : `Note with id ${id} is already deleted`});
                    return;
                }
                element.status = "deleted";
                mess.push({message:`Deleted note with id ${id}`});
                return;
            }
        });
        if(err.length == 0){
            writeFile(file_content);
        }
        return {err, mess};
        }
    catch (error) {
        err.push({error:error})
        return {err, mess};
    }
}

// const show = (id, )


module.exports = {addNote, list_notes, delete_note};