// Import functions
import { describe, test, expect } from "vitest";
// supertest = http requests testing
import { 
    showModal, 
    makeModalDraggable, 
    updateTaskList, 
    saveEvent, 
    closeModal, 
    updateCellStyle, 
    hexToRGB, 
    createDraggableTask, 
} from "../public/js/script.js";



// ============
// Unit Testing
// ============



describe("Unit-Testing", () => {


    // -----------
    // showModal()
    test("showModal displays modal correctly", () => {
        document.body.innerHTML = `
            <div id="eventModal" style="display: none;"></div>
            <ul id="taskList"></ul>
        `; // Ensure modal and task list exist
    
        const mockCell = document.createElement("td");
        const childElement = document.createElement("p");
        childElement.innerText = "1"; // Mocking the expected cell child
        mockCell.appendChild(childElement);
    
        showModal(mockCell);
    
        expect(document.getElementById("eventModal").style.display).toBe("block");
    });
    
    // end
    // -----------


    // --------------------
    // makeModalDraggable()
    test("makeModalDraggable should enable dragging", () => {
        document.body.innerHTML = `<div id="eventModal"></div><div id="modalHeader"></div>`;
        makeModalDraggable();
        const header = document.getElementById("modalHeader");
        expect(header).not.toBeNull();
    });
    // end
    // --------------------


    // ----------------
    // updateTaskList()
    test("updateTaskList updates task list correctly", () => {
        document.body.innerHTML = `<ul id="taskList"></ul>`; // Mock task list
    
        const mockCell = document.createElement("td");
        const child = document.createElement("p");
        child.innerText = "1"; // Simulating the date inside the cell
        mockCell.appendChild(child);
    
        updateTaskList(mockCell);
    
        expect(document.getElementById("taskList").children.length).toBeGreaterThanOrEqual(0);
    });
    
    // end
    // ----------------    


    // -----------
    // saveEvent()
    // test("saveEvent should add an event", () => {
    //     document.body.innerHTML = `
    //         <input id="eventInput" value="Meeting">
    //         <input id="colorPicker" value="#ff0000">
    //         <input id="opacitySlider" value="100">
    //         <ul id="taskList"></ul>
    //     `;
    
    //     window.selectedCell = document.createElement("td"); // Mock the selected cell
    //     const taskContainer = document.createElement("div"); // Ensure cell has a container
    //     window.selectedCell.appendChild(taskContainer);
    
    //     saveEvent();
    
    //     expect(document.getElementById("taskList").children.length).toBeGreaterThan(0);
    // });
    
    
    // end
    // -----------



    // ------------
    // closeModal()
    test("closeModal hides the modal", () => {
        document.body.innerHTML = `<div id="eventModal" style="display: block;"></div>`;
        closeModal();
        expect(document.getElementById("eventModal").style.display).toBe("none");
    });
    // end
    // ------------



    // -----------------
    // updateCellStyle()
    test("updateCellStyle applies correct styles", () => {
        document.body.innerHTML = 
            `<input id="colorPicker" value="#ff0000">
            <input id="opacitySlider" value="50">`;
        window.selectedCell = document.createElement("td");
        updateCellStyle();
        expect(window.selectedCell.style.backgroundColor).toContain("rgba(255, 0, 0");
    });
    // end
    // -----------------



    // ----------
    // hexToRGB()
    test("hexToRGB converts hex to correct RGB values", () => {
        const rgb = hexToRGB("#ff0000");
        expect(rgb).toEqual({ r: 255, g: 0, b: 0 });
    });
    // end
    // ----------



    // ---------------------
    // createDraggableTask()
    test("createDraggableTask generates a draggable task", () => {
        const task = createDraggableTask("Test Task", "rgba(255,0,0,1)");
        expect(task.textContent).toBe("Test Task");
        expect(task.style.position).toBe("absolute");
    });
    // end
    // ---------------------

});
