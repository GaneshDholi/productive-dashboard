const cards = document.querySelectorAll(".card");
const plannerGrid = document.getElementById("plannerGrid");
const mainContainer = document.querySelector("main");
const allCardsContainer = document.getElementById("allcards");
const todoSection = document.getElementById("todo element");
const plannerSection = document.getElementById("planner element");
const motivationSection = document.getElementById("motivation element");
const timerSection = document.getElementById("timer element");
const goalsSection = document.getElementById("Goals element");
const theme = document.getElementById("changeTheme");
const bodyelem = document.querySelector("body");

let schedule = JSON.parse(localStorage.getItem("schedule")) || {
  "6:00 - 7:00": "wake",
  "7:00 - 8:00": "bathing",
  "8:00 - 9:00": "gym",
  "9:00 - 10:00": "---",
  "10:00 - 11:00": "---",
  "11:00 - 12:00": "---",
  "12:00 - 13:00": "---",
  "13:00 - 14:00": "---",
  "14:00 - 15:00": "lunch",
  "15:00 - 16:00": "---",
  "16:00 - 17:00": "---",
  "17:00 - 18:00": "---",
  "18:00 - 19:00": "---",
  "19:00 - 20:00": "classes",
};

cards.forEach((element) => {
  element.addEventListener("click", function () {
    resultId = element.id;

    switch (resultId) {
      case "1":
        if (todoSection) {
          mainContainer.style.display = "none";
          plannerSection.style.display = "none";
          motivationSection.style.display = "none";
          timerSection.style.display = "none";
          goalsSection.style.display = "none";
          allCardsContainer.style.display = "block";
          todoSection.style.display = "block";
        }
        break;
      case "2":
        mainContainer.style.display = "none";
        allCardsContainer.style.display = "block";
        timerSection.style.display = "none";
        if (plannerSection) {
          todoSection.style.display = "none";
          motivationSection.style.display = "none";
          goalsSection.style.display = "none";
          plannerSection.style.display = "block";
        }
        break;
      case "3":
        mainContainer.style.display = "none";
        allCardsContainer.style.display = "block";
        timerSection.style.display = "none";
        if (motivationSection) {
          todoSection.style.display = "none";
          plannerSection.style.display = "none";
          goalsSection.style.display = "none";
          motivationSection.style.display = "block";
        }
        break;
      case "4":
        mainContainer.style.display = "none";
        allCardsContainer.style.display = "block";
        if (timerSection) {
          todoSection.style.display = "none";
          plannerSection.style.display = "none";
          motivationSection.style.display = "none";
          goalsSection.style.display = "none";
          timerSection.style.display = "block";
        }
        break;
      case "5":
        mainContainer.style.display = "none";
        allCardsContainer.style.display = "block";
        timerSection.style.display = "none";
        if (goalsSection) {
          goalsSection.style.display = "block";
          todoSection.style.display = "none";
          plannerSection.style.display = "none";
          motivationSection.style.display = "none";
        }
        break;
    }
  });
});

//time and date
document.addEventListener("DOMContentLoaded", () => {
  const date = document.getElementById("date");
  const daytime = document.getElementById("daytime");
  const cityelem = document.getElementById("city");
  const temp = document.getElementById("temp");
  const whether = document.getElementById("whether");
  const otherWhether = document.querySelector(".other-whether");

  const apiKey = "f2493f236510504172b806f3ea634187";

  async function fetchWhether(city = "Ajmer") {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("City not Found");
      const data = await response.json();

      const now = new Date();
      date.textContent = now.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const { lat, lon } = data.coord;
      const locationRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
      );
      const locationData = await locationRes.json();

      const location = locationData[0];
      cityelem.textContent = `${location.name}, ${location.state}, ${location.country}`;

      temp.textContent = `${Math.round(data.main.temp)}°C`;
      whether.textContent = data.weather[0].description;

      otherWhether.innerHTML = `
        <p>Precipitation: ${data.clouds.all}%</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind: ${data.wind.speed} km/h</p>
      `;
    } catch (error) {
      if (city !== "Ajmer") fetchWhether("Ajmer");
    }
  }

  function startClock() {
    setInterval(() => {
      const now = new Date();
      daytime.textContent = now.toLocaleString("en-IN", {
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    }, 1000);
  }

  startClock();
  fetchWhether();
});

//add task todo
document.addEventListener("DOMContentLoaded", () => {
  const titleInput = document.getElementById("title");
  const detailsTextarea = document.getElementById("details");
  const importantCheckbox = document.getElementById("important");
  const addTaskButton = document.querySelector(".add-task-btn");
  const taskList = document.querySelector(".task-list");
  const closeButton = document.getElementById("close");

  const fixedTasks = [
    {
      title: "Frontend project",
      important: true,
    },
    {
      title: "Animation Masterclass",
      important: true,
    },
  ];

  function saveTasksToLocalStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function getTasksFromLocalStorage() {
    try {
      const tasks = JSON.parse(localStorage.getItem("tasks"));
      return Array.isArray(tasks) ? tasks : [];
    } catch {
      return [];
    }
  }

  function createTaskItem(title, important) {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");
    let taskText = `<span>${title}`;
    if (important) {
      taskText += `<span class="dot"><img src="./assets/red-sticker.png" alt="important" style="height:20px;width:20px;background-size:cover;background-position:center;"></span>`;
    }
    taskText += `</span>`;
    taskItem.innerHTML = taskText;

    const completeButton = document.createElement("button");
    completeButton.classList.add("complete-btn");
    completeButton.textContent = "Mark as Completed";

    completeButton.addEventListener("click", () => {
      taskList.removeChild(taskItem);
      let tasks = getTasksFromLocalStorage();
      tasks = tasks.filter(
        (t) => t.title !== title || t.important !== important
      );
      saveTasksToLocalStorage(tasks);
    });

    taskItem.appendChild(completeButton);
    return taskItem;
  }

  function renderTasks() {
    taskList.innerHTML = "";
    fixedTasks.forEach(({ title, important }) => {
      const fixedTask = createTaskItem(title, important);
      taskList.appendChild(fixedTask);
    });
    const tasks = getTasksFromLocalStorage();
    tasks.forEach(({ title, important }) => {
      if (
        !fixedTasks.some(
          (ft) => ft.title === title && ft.important === important
        )
      ) {
        const taskItem = createTaskItem(title, important);
        taskList.appendChild(taskItem);
      }
    });
  }

  function addTask() {
    if (!importantCheckbox.checked) {
      alert("You must mark the task as important!");
      return;
    }
    const title = titleInput.value.trim();
    if (title === "") {
      alert("Please enter a project title.");
      return;
    }
    const task = { title, important: true };
    let tasks = getTasksFromLocalStorage();
    tasks.push(task);
    saveTasksToLocalStorage(tasks);

    const newTask = createTaskItem(title, true);
    taskList.appendChild(newTask);

    titleInput.value = "";
    detailsTextarea.value = "";
    importantCheckbox.checked = false;
  }

  addTaskButton.addEventListener("click", addTask);
  titleInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
  });

  renderTasks();

  closeButton.addEventListener("click", () => {
    if (todoSection) {
      todoSection.style.display = "none";
      allCardsContainer.style.display = "none";
      mainContainer.style.display = "block";
    }
  });
});

//planner
document.addEventListener("DOMContentLoaded", () => {
  renderSchedule();

  plannerGrid.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const newTime = prompt("Enter time slot (e.g., 20:00 - 21:00):");
      const newTask = prompt("Enter task:");
      if (newTime && newTask) {
        schedule[newTime] = newTask;
        saveAndRender();
      }
    }
  });

  document.getElementById("closePlanning").addEventListener("click", () => {
    plannerSection.style.display = "none";
    mainContainer.style.display = "block";
  });

  function saveToLocalStorage() {
    localStorage.setItem("schedule", JSON.stringify(schedule));
  }

  function renderSchedule() {
    plannerGrid.innerHTML = "";
    Object.entries(schedule).forEach(([time, task]) => {
      const block = document.createElement("div");
      block.classList.add("block");
      block.innerHTML = `
        <h4>${time}</h4>
        <p contenteditable="true" class="editable">${task}</p>
        <button class="save-btn">Save</button>
        <button class="delete-btn">Delete</button>
      `;
      plannerGrid.appendChild(block);

      block.querySelector(".save-btn").addEventListener("click", () => {
        const newText = block.querySelector(".editable").textContent.trim();
        schedule[time] = newText;
        saveToLocalStorage();
      });

      block.querySelector(".delete-btn").addEventListener("click", () => {
        if (confirm(`Delete task for "${time}"?`)) {
          delete schedule[time];
          saveAndRender();
        }
      });
    });
  }

  function saveAndRender() {
    saveToLocalStorage();
    renderSchedule();
  }
});

//motivation
document.addEventListener("DOMContentLoaded", () => {
  const quoteText = document.getElementById("quoteText");
  const quoteAuthor = document.getElementById("quoteAuthor");
  let main = mainContainer;

  async function loadQuote() {
    quoteText.innerText = "Loading...";
    quoteAuthor.innerText = "";
    try {
      const response = await fetch("https://dummyjson.com/quotes/random");
      const data = await response.json();
      quoteText.innerText = data.quote;
      quoteAuthor.innerText = "— " + data.author;
    } catch (err) {
      quoteText.innerText = "Failed to load quote.";
      quoteAuthor.innerText = "";
    }
  }

  loadQuote();

  document.getElementById("closeMotivation").addEventListener("click", () => {
    if (motivationSection) main.style.display = "block";
    motivationSection.style.display = "none";
    allCardsContainer.style.display = "none";
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "m" && "M") {
      loadQuote();
    }
  });
});

//pomo doro
document.addEventListener("DOMContentLoaded", () => {
  let timer;
  let timeLeft = 25 * 60;
  let isRunning = false;
  let isWorkSession = true;

  const timerDisplay = document.getElementById("timer");
  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const resetBtn = document.getElementById("resetBtn");
  const sessionLabel = document.getElementById("sessionLabel");

  function updateDisplay() {
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const seconds = String(timeLeft % 60).padStart(2, "0");
    timerDisplay.textContent = `${minutes}:${seconds}`;
  }

  function startTimer() {
    if (isRunning || timeLeft <= 0) return;
    isRunning = true;

    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        clearInterval(timer);
        isRunning = false;

        if (isWorkSession) {
          alert("Work session complete! Start your 5-minute break.");
          isWorkSession = false;
          timeLeft = 5 * 60;
          sessionLabel.textContent = "Break Session";
          sessionLabel.classList.remove("work");
          sessionLabel.classList.add("break");
          updateDisplay();
        } else {
          alert("Break is over. Task is complete.");
          startBtn.disabled = true;
        }
      }
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
  }

  function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    isWorkSession = true;
    timeLeft = 25 * 60;
    sessionLabel.textContent = "Work Session";
    sessionLabel.classList.remove("break");
    sessionLabel.classList.add("work");
    startBtn.disabled = false;
    updateDisplay();
  }

  startBtn.addEventListener("click", startTimer);
  pauseBtn.addEventListener("click", pauseTimer);
  resetBtn.addEventListener("click", resetTimer);

  sessionLabel.classList.add("work");

  document.getElementById("closeTimer").addEventListener("click", () => {
    if (timerSection) 
    mainContainer.style.display = "block";
    timerSection.style.display = "none";
    allCardsContainer.style.display = "none";
  });
  updateDisplay();
});

//life goals
document.addEventListener('DOMContentLoaded', () => {
  const goalInput = document.getElementById("goalInput");
  const addGoalBtn = document.getElementById("addGoalBtn");
  const goalList = document.getElementById("goalList");

  let goals = JSON.parse(localStorage.getItem("lifeGoals")) || [];

  function renderGoals() {
    goalList.innerHTML = "";
    goals.forEach((goal, index) => {
      const li = document.createElement("li");

      const span = document.createElement("span");
      span.textContent = goal;
      span.contentEditable = true;
      span.addEventListener("blur", () => {
        goals[index] = span.textContent.trim();
        saveGoals();
      });

      const removeBtn = document.createElement("button");
      removeBtn.innerHTML = "✕";
      removeBtn.className = "goal-remove";
      removeBtn.onclick = () => {
        goals.splice(index, 1);
        saveGoals();
        renderGoals();
      };

      li.appendChild(span);
      li.appendChild(removeBtn);
      goalList.appendChild(li);
    });
  }

  function saveGoals() {
    localStorage.setItem("lifeGoals", JSON.stringify(goals));
  }

  addGoalBtn.addEventListener("click", () => {
    const goal = goalInput.value.trim();
    if (goal) {
      goals.push(goal);
      goalInput.value = "";
      saveGoals();
      renderGoals();
    }
  });

  goalInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      addGoalBtn.click();
    }
  });

  document.getElementById("closeGoals").addEventListener("click", () => {
    if (goalsSection) 
    mainContainer.style.display = "block";
    goalsSection.style.display = "none";
    allCardsContainer.style.display = "none";
    
  });

  renderGoals();
});


//theme change
const themes = [
  {
    "--pri": "#222831",
    "--sec": "#393E46",
    "--ter1": "#948979",
    "--ter2": "#DFD0B8"
  },
  {
    "--pri": "#626F47",
    "--sec": "#A4B465",
    "--ter1": "#FFCF50",
    "--ter2": "#FEFAE0"
  },
  {
    "--pri": "#2E5077",
    "--sec": "#4DA1A9",
    "--ter1": "#79D7BE",
    "--ter2": "#F6F4F0"
  },
  {
    "--pri": "#B33791",
    "--sec": "#C562AF",
    "--ter1": "#DB8DD0",
    "--ter2": "#FEC5F6"
  },
  {
    "--pri": "#EEEEEE",
    "--sec": "#787A91",
    "--ter1": "#141E61",
    "--ter2":  "#0F044C"
  }
];

let currentTheme = 0;


theme.addEventListener("click", () => {
  const root = document.documentElement;
  const theme = themes[currentTheme];

  for (const variable in theme) {
    root.style.setProperty(variable, theme[variable]);
  }

  currentTheme = (currentTheme + 1) % themes.length; 
});
