document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("task-form");
  const taskInput = document.getElementById("task-input");
  const taskList = document.getElementById("task-list");
  const progressText = document.getElementById("progress-text");
  const progressFilled = document.getElementById("progress-filled");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateProgress();
  };

  const updateProgress = () => {
    const completedTasks = tasks.filter((task) => task.done).length;
    progressText.textContent = `${completedTasks}/${tasks.length} tasks completed`;
    progressFilled.style.width = tasks.length
      ? `${(completedTasks / tasks.length) * 100}%`
      : "0";
  };

  const renderTasks = () => {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = task.done ? "done" : "";
      li.innerHTML = `
                <span>${task.name}</span>
                <div class="actions">
                    <button class="check">${task.done ? "☑️" : "✅"}</button>
                    <button class="edit">✏️</button>
                    <button class="delete">❌</button>
                </div>
            `;

      li.querySelector(".check").addEventListener("click", () => {
        tasks[index].done = !tasks[index].done;
        saveTasks();
        renderTasks();
      });

      li.querySelector(".edit").addEventListener("click", () => {
        const newName = prompt("Update task:", task.name);
        if (newName) {
          tasks[index].name = newName.trim();
          saveTasks();
          renderTasks();
        }
      });

      li.querySelector(".delete").addEventListener("click", () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
      });

      taskList.appendChild(li);
    });
  };

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newTask = { name: taskInput.value.trim(), done: false };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = "";
  });

  renderTasks();
  updateProgress();
});
