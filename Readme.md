# MyCli

A lightweight CLI tool to manage your tasks and notes — straight from the terminal.

## Features

- Add, list, and delete **notes**
- Add, complete, and track **tasks**
- Simple command structure
- Clean and minimal UX — just you and your work

## Installation

```bash
npm install -g handy-terminal
```

## Commands

### Notes

- `add-note [options] <title>` — Add a new note ✍️  
- `ls-note [options]` — List all notes  
- `delete-note <id>` — Delete a note  

### Tasks

- `add-task [options] <title>` — Create a task  
- `ls-task` — List all tasks  
- `task-done <id>` — Mark a task as complete ✅  
- `delete-task <id>` — Delete a task  
- `log-task` — View task history  

### Help

```bash
help [command]
```

Get usage info for any command.

## Example

```bash
add-task "Finish CLI tool"
task-done 1
log-task

add-note "CLI tools > GUI for quick thoughts"
ls-note
```

## Dev Setup

```bash
git clone https://github.com/jey-exp/cli-tool-node.git
cd cli-tool-node
npm install
npm link
```
_You are good to go!_ 

Now call it by `mycli` in your terminal

---

**License:** MIT  
**Made for devs who live in the terminal.**
