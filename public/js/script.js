// const { text } = require("express");

// GLOBAL EVENT TRACKER (position, color, eventlistener, etc..)
let eventList = {};
let draggedElement = null; // Track dragged task

let currentDate = new Date()


// unit-tests
// export { 
//     showModal, 
//     makeModalDraggable, 
//     updateTaskList, 
//     saveEvent, 
//     closeModal, 
//     updateCellStyle, 
//     hexToRGB, 
//     createDraggableTask, 
//     renderCalender, 
// };

// Basic DOM Loader
document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll("td button");
    // Live color updater
    // document.getElementById("colorPicker").addEventListener("input", updateCellStyle);
    // document.getElementById("opacitySlider").addEventListener("input", updateCellStyle);

    document.getElementById("backgroundColorPicker").addEventListener("input", (event) => {
        document.body.style.backgroundColor = event.target.value;
    });

    // get url for header
    const routeDisplay = document.getElementById("routeDisplay");
    if (routeDisplay) {
        routeDisplay.textContent = window.location.href;
    }

    // Get clicked cell
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const selectedCell = button.parentElement;
            showModal(selectedCell);
        });
    });

    // Live draggable Modal ( WIP NOT WORKING )
    makeModalDraggable();

    renderCalender()

    showNotifications()
});

// ======
// VITEST EXPORT
// ======
if (typeof window !== "undefined") {
    window.showModal = showModal;
    window.makeModalDraggable = makeModalDraggable;
    window.updateTaskList = updateTaskList;
    window.saveEvent = saveEvent;
    window.closeModal = closeModal;
    window.updateCellStyle = updateCellStyle;
    window.hexToRGB = hexToRGB;
    window.createDraggableTask = createDraggableTask;
}

// Export functions for Vitest
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        showModal, makeModalDraggable, updateTaskList, saveEvent,
        closeModal, updateCellStyle, hexToRGB, createDraggableTask
    };
}

// ==========
// Show Modal
function showModal(cell) {
    // Based on ID (cell)
    document.getElementById("eventModal").style.display = "block";
    window.selectedCell = cell;
    updateTaskList(cell);
}



function makeModalDraggable() {
    const modal = document.getElementById("eventModal");
    const header = document.getElementById("modalHeader");

    let offsetX, offsetY, isDragging = false;

    header.addEventListener("mousedown", (event) => {
        isDragging = true;

        // Ensure absolute positioning before dragging
        modal.style.position = "absolute";
        modal.style.left = `${modal.offsetLeft}px`;
        modal.style.top = `${modal.offsetTop}px`;

        // Correct offset calculations
        offsetX = event.clientX - modal.offsetLeft;
        offsetY = event.clientY - modal.offsetTop;

        document.addEventListener("mousemove", dragMove);
        document.addEventListener("mouseup", stopDragging);
    });

    function dragMove(event) {
        if (!isDragging) return;

        modal.style.left = `${event.clientX - offsetX}px`;
        modal.style.top = `${event.clientY - offsetY}px`;
    }

    function stopDragging() {
        isDragging = false;
        document.removeEventListener("mousemove", dragMove);
        document.removeEventListener("mouseup", stopDragging);
    }
}


// ---------
// Task List
function updateTaskList(cell) {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    // Generate a reliable unique identifier for the cell
    // const rowIndex = cell.parentElement.rowIndex;
    // const colIndex = cell.cellIndex;
    // const cellKey = `${rowIndex}-${colIndex}`;

    // console.log("Updating task list for:", cellKey); // Debugging log


    let yearMonth = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`

    let cellDate = parseInt(cell.children[0].innerText)


    if (eventList[yearMonth]?.[cellDate] && eventList[yearMonth][cellDate].events.length > 0) {
        eventList[yearMonth][cellDate].events.forEach((taskObj, index) => {

            const listItem = document.createElement("li");
            listItem.textContent = `${taskObj.text}`;

            // Add delete button
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "🗑";
            deleteBtn.style.marginLeft = "10px";
            deleteBtn.style.background = "red";
            deleteBtn.style.color = "white";
            deleteBtn.style.border = "none";
            deleteBtn.style.cursor = "pointer";

            // Remove task on click
            deleteBtn.addEventListener("click", () => {
                eventList[yearMonth][cellDate].events.splice(index, 1);
                cell.lastElementChild.children[index].remove()

                console.log("delete test: ", eventList);

                updateTaskList(cell);
            });

            listItem.appendChild(deleteBtn);
            taskList.appendChild(listItem);
        });
    } else {
        // console.log("No tasks found for:", cellKey); 
    }

}


function saveEvent() {
    const eventText = document.getElementById("eventInput").value;
    if (!eventText.trim()) return; // Prevent empty entries

    const cell = window.selectedCell;

    const selectedColor = document.getElementById("colorPicker").value;
    const selectedOpacity = document.getElementById("opacitySlider").value / 100;
    const convertedColor = hexToRGB(selectedColor)

    const color = `rgba(${convertedColor.r},${convertedColor.g},${convertedColor.b},${selectedOpacity})`

    // Generate unique identifier using row and column index
    // const rowIndex = cell.parentElement.rowIndex;
    // const colIndex = cell.cellIndex;
    // const cellKey = `${rowIndex}-${colIndex}`;

    const task = createDraggableTask(eventText, color);
    cell.lastElementChild.appendChild(task);



    const cellDate = parseInt(cell.children[0].innerText);
    const key = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`



    const event = {
        text: eventText,
        color
    }

    // check if year-month exists
    if (eventList.hasOwnProperty(key)) {
        // check if date already exists
        if (eventList[key].hasOwnProperty(cellDate)) {
            // Handling color change on an already occupied cell

            // eventList[key][cellDate].color !=  `rgba(${convertedColor.r},${convertedColor.g},${convertedColor.b},${selectedOpacity})`
            eventList[key][cellDate].events.push(event)

        }

        // yy-mm exists but not date
        else {

            eventList[key][cellDate] = { events: [event] }

        }
    }
    else {
        eventList[key] = {
            [cellDate]: {
                events: [event]
            }
        }

    }
    updateTaskList(cell);
    console.log("Event added : ", eventList)
}



// Close Modal
function closeModal() {
    document.getElementById("eventModal").style.display = "none";
}

// =============
// MODIFICATIONS
// =============



// for header
function goBack() {
    window.history.back();
}

// for methods (.push .splice etc..)
function updateCellStyle() {
    if (!window.selectedCell) return;

    // for rgb live update (see dom loader) 
    const selectedColor = document.getElementById("colorPicker").value;
    const selectedOpacity = document.getElementById("opacitySlider").value / 100;


    // Convert hex color to RGB and apply transparency
    const rgbColor = hexToRGB(selectedColor);
    // Update
    window.selectedCell.style.backgroundColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${selectedOpacity})`;
}

// Convert HEX to RGB for rgba()
// Reused from Pomodoro Timer
function hexToRGB(hex) {
    hex = hex.replace("#", "");
    const bigint = parseInt(hex, 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}

// =================
// DRAGGABLE ELEMENT | sourced from StackOverflow + Pomodoro project
// =================


// Create Draggable Task
function createDraggableTask(text, color) {
    // border for boundary
    const task = document.createElement("div");
    task.textContent = text;
    task.classList.add("draggable-task");
    task.style.position = "absolute";
    task.style.left = "5px";
    task.style.top = "5px";
    task.style.cursor = "grab";
    task.style.background = color;
    task.style.padding = "2px 4px";
    task.style.borderRadius = "3px";
    task.style.whiteSpace = "nowrap";

    task.addEventListener("mousedown", startDragging);

    return task;
}

// Start Dragging
function startDragging(event) {
    draggedElement = event.target;
    document.addEventListener("mousemove", dragMove);
    document.addEventListener("mouseup", stopDragging);
}

// Move Dragged Element in Real-Time
function dragMove(event) {
    if (!draggedElement) return;

    const cell = draggedElement.parentElement;

    // Get cursor position relative to the cell
    let newLeft = event.clientX - cell.getBoundingClientRect().left - (draggedElement.offsetWidth / 2);
    let newTop = event.clientY - cell.getBoundingClientRect().top - (draggedElement.offsetHeight / 2);

    // Keep inside strict boundaries
    const maxX = cell.offsetWidth - draggedElement.offsetWidth - 5;
    const maxY = cell.offsetHeight - draggedElement.offsetHeight - 5;

    // update cell to new positions
    draggedElement.style.left = `${Math.max(5, Math.min(newLeft, maxX))}px`;
    draggedElement.style.top = `${Math.max(5, Math.min(newTop, maxY))}px`;
}

// Stop Dragging
function stopDragging() {
    document.removeEventListener("mousemove", dragMove);
    document.removeEventListener("mouseup", stopDragging);
    draggedElement = null;
}

const renderCalender = (date) => {

    // Sets current date to input or defaults to current date
    currentDate = (typeof date === 'undefined') ? new Date() : new Date(date)
    console.log(currentDate);

    currentDate.setDate(1)

    // if same year-month no change
    if (date === `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`) return;

    // like mon, tue, wed
    let startingDay = currentDate.getDay()

    // get the last date of the month ie the 30th
    let lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
    let yearMonth = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`

    // clears tasks
    Array.from(document.querySelectorAll(".draggable-task")).forEach((task) => {
        task.remove()
    })

    let squares = document.getElementsByTagName("td")

    let count = 1
    squares = Array.from(squares).forEach((square, index) => {
        // Resets cells
        square.removeAttribute("class")
        square.removeAttribute("style")

        // first child should be P 
        square.firstElementChild.innerText = ""

        // initializes cells 
        if (index >= startingDay && count <= lastDate) {

            // look up events for this day
            if (eventList[yearMonth] && eventList[yearMonth][count]) {

                // square.style.backgroundColor = eventList[yearMonth][count].color

                eventList[yearMonth][count].events.forEach((task) => {
                    square.lastElementChild.appendChild(createDraggableTask(task.text, task.color))
                })
            }

            // any square with the class .date is a correct cell
            square.classList.add("date")
            square.firstElementChild.innerText = count
            count++
        }
    })
    console.log(currentDate, startingDay, lastDate, squares);
    const months = ['January', 'February', 'March', 'April', "May", "June", 'July', 'August', 'September', 'October', 'November', 'December']
    let h2 = document.getElementById("month-year")
    h2.innerText = `${months[currentDate.getMonth()]} - ${currentDate.getFullYear()}`
    console.log("event list", eventList);
}


// show notifications once
const showNotifications = () => {
    // TODO account for checking next month

    // decoy list
    const eventList = {
        "2025-5": {
            16: {
                events: [
                    {
                        text: "pop",
                        color: "rgba()"
                    }
                ]
            },
            17: {
                events: [
                    {
                        text: "oquiz"
                    }
                ]
            }
        },
        "2025-6": {
            1: {
                events: [
                    { text: "PE Final" }
                ]
            },
            9: {
                events: [
                    { text: "Boobs Final" }
                ]
            },
        }
    }

    const currentDate = new Date()

    let lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
    let yearMonth = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`

    console.log("year-month", yearMonth, "last date", lastDate);


    // console.log(key, eventList[key]);
    console.log(eventList);


    if (typeof eventList[yearMonth] == "undefined" || Object.keys(eventList[yearMonth]).length == 0) {
        console.log("No notifs", Object.keys(eventList).length > 0);
        return

    }

    // create/unhide modal 

    // get tasks due within x days



    console.log(currentDate);


    let dueShit = []

    // let month = currentDate.getMonth() + 1;
    // let year = currentDate.getFullYear();
    // console.log(month, year);


    // let temp = new Date()
    // temp.setDate(currentDate.getDate() + dueSoon)

    // let tMonth = temp.getMonth() + 1;
    // let tYear = temp.getFullYear();

    // console.log(temp);


    // either check every date range for events OR iterate over the events and check if in range 
    const dueSoon = 25

    for (let index = currentDate.getDate(); index <= currentDate.getDate() + dueSoon; index++) {
        console.log(index);

        temp = new Date()
        temp.setDate(index)
        let key = `${temp.getFullYear()}-${temp.getMonth() + 1}`
        let key2 = temp.getDate()

        console.log(key, key2);
        // check year-month against date + dueSoon to see if we need to check mult months / years



        // check if there are any events for that date
        if (eventList[key]?.[key2]?.events.length > 0) {

            // check events for that date
            eventList[key][key2]?.events.forEach(x => {
                console.log(x);

                dueShit.push({ text: x.text, due: index - currentDate.getDate() })
            })

        }

    }

    console.log("Due Shit: ", dueShit)

    let notifsBox = document.querySelector("#notif-box")

    dueShit.forEach(course => {
        const courseItem = document.createElement("div");
        courseItem.className = "course-item"
        const courseText = document.createElement("div");
        courseText.innerText = course.text

        const courseDue = document.createElement("div");

        switch (course.due) {
            case 0:

                courseDue.innerText = "Today"
                break;

            case 1:
                courseDue.innerText = "Tomorrow"
                break;

            default:

                courseDue.innerText = course.due + " days"
                break;
        }


        courseItem.appendChild(courseText)
        courseItem.appendChild(courseDue)
        notifsBox.appendChild(courseItem)
        document.body.style.overflow = "hidden"

    })







}


const exitNotifications = () => {
    console.log("FUCK YOU");
    
    // reenable scrollbar
    document.body.style.overflow = "auto";

    // rehide modal
    let modal = document.querySelector("#notifcation-modal");


    modal.style.display = "none"



}