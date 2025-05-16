document.addEventListener("DOMContentLoaded", () => {
    const nameInput = document.getElementById("course-name");
    const colorInput = document.getElementById("course-color");
    const list = document.getElementById("course-list");
    const addBtn = document.getElementById("add-course");
  
    async function loadCourses() {
      const res = await fetch("/courses");
      const courses = await res.json();
      list.innerHTML = "";
  
      Object.entries(courses).forEach(([name, color]) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <span style="color:${color};font-weight:bold">${name}</span>
          <button data-name="${name}" class="delete-btn">DELETE</button>
        `;
        list.appendChild(li);
      });
    }
  
    addBtn.addEventListener("click", async () => {
      const name = nameInput.value.trim();
      const color = colorInput.value;
      if (!name) return alert("Enter a course name");
  
      await fetch("/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, color })
      });
      nameInput.value = "";
      await loadCourses();
    });
  
    list.addEventListener("click", async (e) => {
      if (e.target.classList.contains("delete-btn")) {
        const name = e.target.dataset.name;
        await fetch(`/courses/${encodeURIComponent(name)}`, { method: "DELETE" });
        await loadCourses();
      }
    });
  
    loadCourses();
  });
  