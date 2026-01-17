// Global variables
let currentUser = null;
let userProfile = {};
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let workouts = {}; // Store workouts by date
let completed = {}; // Store completion status by date

// Firebase initialization (placeholder - replace with actual config)
const firebaseConfig = {
  // Add your Firebase config here
};

// Initialize Firebase if config is provided
if (firebaseConfig.apiKey) {
  // Firebase initialization would go here
}

// Plan generation logic
function generatePlan(level) {
  const plans = {
    beginner: {
      semaine1: {
        lundi:
          "Pompes : 3 séries de 10, Squats : 3 séries de 15, Planche : 3 séries de 20 secondes",
        mercredi:
          "Tractions (assistées) : 3 séries de 8, Fentes : 3 séries de 10 par jambe, Russian twists : 3 séries de 15",
        vendredi:
          "Développé couché (haltères) : 3 séries de 12 répétitions, soulevé de terre (léger) : 3 séries de 10 répétitions, mountain climbers : 3 séries de 30 secondes",
      },
      semaine2: {
        lundi:
          "Pompes : 3 séries de 12, Squats : 3 séries de 18, Planche : 3 séries de 25 secondes",
        mercredi:
          "Tractions (assistées) : 3 séries de 10, Fentes : 3 séries de 12 par jambe, Russian twists : 3 séries de 18",
        vendredi:
          "Développé couché (haltères) : 3 séries de 15 répétitions, soulevé de terre (léger) : 3 séries de 12 répétitions, mountain climbers : 3 séries de 35 secondes",
      },
      semaine3: {
        lundi:
          "Pompes : 3 séries de 15, Squats : 3 séries de 20, Planche : 3 séries de 30 secondes",
        mercredi:
          "Tractions (assistées) : 3 séries de 12, Fentes : 3 séries de 15 par jambe, Russian twists : 3 séries de 20",
        vendredi:
          "Développé couché (haltères) : 3 séries de 18 répétitions, soulevé de terre (léger) : 3 séries de 15 répétitions, mountain climbers : 3 séries de 40 secondes",
      },
      semaine4: {
        lundi:
          "Pompes : 3 séries de 18, Squats : 3 séries de 25, Planche : 3 séries de 35 secondes",
        mercredi:
          "Tractions (assistées) : 3 séries de 15, Fentes : 3 séries de 18 par jambe, Russian twists : 3 séries de 25",
        vendredi:
          "Développé couché (haltères) : 3 séries de 20 répétitions, soulevé de terre (léger) : 3 séries de 18 répétitions, mountain climbers : 3 séries de 45 secondes",
      },
    },
    intermediate: {
      // Similar structure with harder exercises
      semaine1: {
        lundi: "Pompes: 4x15, Squats: 4x20, Planche: 4x45s",
        mercredi:
          "Tractions: 4x8, Fentes: 4x15 chaque jambe, Twists russes: 4x20",
        vendredi:
          "Développé couché: 4x12, Soulevé de terre: 4x6–8, Burpees: 4x10",
      },
      semaine2: {
        lundi: "Pompes: 4x18, Squats: 4x22, Planche: 4x50s",
        mercredi:
          "Tractions: 4x9, Fentes: 4x18 chaque jambe, Twists russes: 4x25",
        vendredi:
          "Développé couché: 4x12, Soulevé de terre: 4x6–8, Burpees: 4x12",
      },
      semaine3: {
        lundi: "Pompes: 5x15, Squats: 5x20, Planche: 4x55s",
        mercredi:
          "Tractions: 5x8, Fentes: 4x20 chaque jambe, Mountain climbers: 4x40s",
        vendredi:
          "Développé couché: 5x10, Soulevé de terre: 4x6, Burpees: 4x15",
      },
      semaine4: {
        lundi: "Pompes: 5x18, Squats: 5x22, Planche: 4x60s",
        mercredi:
          "Tractions: 5x10, Fentes bulgares: 4x12 chaque jambe, Relevés de jambes: 4x15",
        vendredi:
          "Développé couché: 5x12, Soulevé de terre: 5x5, Burpees: 4x15–20",
      },
    },
    advanced: {
      // Even harder
      semaine1: {
        lundi: "Pompes: 5x20, Squats: 5x25, Planche: 5x60s",
        mercredi:
          "Tractions: 5x12, Fentes: 5x20 chaque jambe, Twists russes: 5x30",
        vendredi:
          "Développé couché: 5x15, Soulevé de terre: 5x12, Burpees: 5x15",
      },
      semaine2: {
        lundi: "Pompes: 5x25, Squats: 5x28, Planche: 5x70s",
        mercredi:
          "Tractions: 5x13, Fentes: 5x22 chaque jambe, Twists russes: 5x35",
        vendredi:
          "Développé couché: 5x15–18, Soulevé de terre: 5x10, Burpees: 5x18",
      },
      semaine3: {
        lundi: "Pompes déclinées: 5x20, Squats sautés: 5x20, Planche: 5x80s",
        mercredi:
          "Tractions lestées: 5x8–10, Fentes marchées: 5x24 chaque jambe, Mountain climbers: 5x50s",
        vendredi:
          "Développé couché: 6x12, Soulevé de terre: 5x8, Burpees: 5x20",
      },
    },
  };

  console.log(
    "Generated plan for level:",
    level,
    plans[level] || plans.beginner
  );
  return plans[level] || plans.beginner;
}

// Add plan to calendar
function addPlanToCalendar(plan) {
  console.log("Adding plan to calendar:", plan);
  const planDates = [];
  // Calculate starting lundi
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const daysToNextMonday = (8 - dayOfWeek) % 7 || 7; // if today Mon, 7, else days to next
  const startMonday = new Date(today);
  startMonday.setDate(today.getDate() + daysToNextMonday);
  console.log("startMonday:", startMonday);
  let currentDate = new Date(startMonday);

  for (let weekKey in plan) {
    const week = plan[weekKey];
    for (let dayKey in week) {
      const dateKey = `${currentDate.getFullYear()}-${
        currentDate.getMonth() + 1
      }-${currentDate.getDate()}`;
      if (!workouts[dateKey]) workouts[dateKey] = [];
      const exercises = week[dayKey]
        .split(", ")
        .map((ex) => ex.split(" : ")[0]);
      exercises.forEach((ex) => workouts[dateKey].push(ex));
      planDates.push(dateKey);
      // Advance date
      if (dayKey === "lundi") {
        currentDate.setDate(currentDate.getDate() + 2); // Mon to Wed
      } else if (dayKey === "mercredi") {
        currentDate.setDate(currentDate.getDate() + 2); // Wed to Fri
      } else if (dayKey === "vendredi") {
        currentDate.setDate(currentDate.getDate() + 3); // Fri to next Mon
      }
    }
  }
  currentYear = startMonday.getFullYear();
  currentMonth = startMonday.getMonth();

  localStorage.setItem("workouts", JSON.stringify(workouts));
  localStorage.setItem("planDates", JSON.stringify(planDates));
  console.log("planDates:", planDates);

  //if (typeof renderCalendar === "function") renderCalendar();
  if (typeof renderCalendar === "function") renderCalendar();
}

// Update dashboard progress
function updateDashboard() {
  const planDates = JSON.parse(localStorage.getItem("planDates")) || [];
  if (planDates.length > 0) {
    const completedCount = planDates.filter((date) => completed[date]).length;
    const percentage = Math.round((completedCount / planDates.length) * 100);
    const progressFill = document.getElementById("planProgress");
    const progressText = document.getElementById("planProgressText");
    if (progressFill) progressFill.style.width = percentage + "%";
    if (progressText)
      progressText.textContent = percentage + "% of plan completed";
  }
}

// Display generated plan
function displayPlan(plan) {
  console.log("Displaying plan:", plan);
  const planDisplay = document.getElementById("planDisplay");
  planDisplay.innerHTML = "";

  for (let week in plan) {
    const weekDiv = document.createElement("div");
    weekDiv.className = "plan-week";
    weekDiv.innerHTML = `<h3>${
      week.charAt(0).toUpperCase() + week.slice(1)
    }</h3>`;

    for (let day in plan[week]) {
      const dayDiv = document.createElement("div");
      dayDiv.className = "plan-day";
      dayDiv.innerHTML = `<strong>${
        day.charAt(0).toUpperCase() + day.slice(1)
      }:</strong> ${plan[week][day]}`;
      weekDiv.appendChild(dayDiv);
    }

    planDisplay.appendChild(weekDiv);
  }
}

// Calendar functionality
function renderCalendar() {
  const calendarGrid = document.getElementById("calendarGrid");
  const monthYear = document.getElementById("monthYear");

  calendarGrid.innerHTML = "";
  monthYear.textContent = new Date(
    currentYear,
    currentMonth
  ).toLocaleDateString("fr-CA", { month: "long", year: "numeric" });

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "calendar-day";
    calendarGrid.appendChild(emptyCell);
  }

  // Add cells for each day of the month
  for (let day = 1; day <= lastDate; day++) {
    const dayCell = document.createElement("div");
    dayCell.className = "calendar-day";
    dayCell.innerHTML = `<div class="day-number">${day}</div>`;

    const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
    if (workouts[dateKey]) {
      dayCell.classList.add("has-workout");
      workouts[dateKey].forEach((workout) => {
        const workoutItem = document.createElement("div");
        workoutItem.className = "workout-item";
        workoutItem.textContent = workout;
        dayCell.appendChild(workoutItem);
      });
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "completion-checkbox";
      checkbox.dataset.date = dateKey;
      checkbox.checked = completed[dateKey] || false;
      dayCell.appendChild(checkbox);
    }

    dayCell.addEventListener("click", () => openWorkoutModal(dateKey, day));
    calendarGrid.appendChild(dayCell);
  }
}

function openWorkoutModal(dateKey, day) {
  const modal = document.getElementById("workoutModal");
  const modalDate = document.getElementById("modalDate");
  const workoutList = document.getElementById("workoutList");

  modalDate.textContent = new Date(
    currentYear,
    currentMonth,
    day
  ).toDateString();
  workoutList.innerHTML = "";

  if (workouts[dateKey]) {
    workouts[dateKey].forEach((workout, index) => {
      const workoutDiv = document.createElement("div");
      workoutDiv.textContent = workout;
      workoutList.appendChild(workoutDiv);
    });
  }

  modal.style.display = "block";

  document.querySelector(".close").onclick = () =>
    (modal.style.display = "none");
  document.getElementById("addWorkoutBtn").onclick = () => addWorkout(dateKey);
}

function addWorkout(dateKey) {
  const workout = prompt("Enter workout details:");
  if (workout) {
    if (!workouts[dateKey]) workouts[dateKey] = [];
    workouts[dateKey].push(workout);
    localStorage.setItem("workouts", JSON.stringify(workouts));
    renderCalendar();
    document.getElementById("workoutModal").style.display = "none";
  }
}

// Exercise gallery
const exercises = {
  chest: [
    {
      name: "Pompes",
      description:
        "Exercice classique au poids du corps pour développer la poitrine.",
      image: "https://via.placeholder.com/250x150?text=Push-ups",
    },
    {
      name: "Développé couché",
      description:
        "Développé couché avec haltères ou barre pour renforcer la poitrine.",
      image: "https://via.placeholder.com/250x150?text=Bench+Press",
    },
    {
      name: "Écartés poitrine",
      description: "Exercice d'isolation pour les muscles pectoraux.",
      image: "https://via.placeholder.com/250x150?text=Chest+Flyes",
    },
  ],
  back: [
    {
      name: "Tractions",
      description: "Exercice de traction du haut du corps.",
      image: "https://via.placeholder.com/250x150?text=Pull-ups",
    },
    {
      name: "Tirage",
      description: "Rameur penché ou assis pour le dos.",
      image: "https://via.placeholder.com/250x150?text=Rows",
    },
    {
      name: "Soulevé de terre",
      description: "Exercice complet du corps mettant l'accent sur le dos.",
      image: "https://via.placeholder.com/250x150?text=Deadlifts",
    },
  ],
  legs: [
    {
      name: "Squats",
      description: "Exercice fondamental pour le bas du corps.",
      image: "https://via.placeholder.com/250x150?text=Squats",
    },
    {
      name: "Fentes",
      description: "Exercice unilatéral pour les jambes.",
      image: "https://via.placeholder.com/250x150?text=Lunges",
    },
    {
      name: "Presse à cuisses",
      description: "Exercice pour les jambes à l'aide d'un appareil.",
      image: "https://via.placeholder.com/250x150?text=Leg+Press",
    },
  ],
  shoulders: [
    {
      name: "Développé militaire",
      description: "Mouvement de poussée avec les épaules.",
      image: "https://via.placeholder.com/250x150?text=Overhead+Press",
    },
    {
      name: "Élévations latérales",
      description: "Isolement pour les deltoïdes latéraux.",
      image: "https://via.placeholder.com/250x150?text=Lateral+Raises",
    },
    {
      name: "Élévations frontales",
      description: "Isolement des deltoïdes antérieurs.",
      image: "https://via.placeholder.com/250x150?text=Front+Raises",
    },
  ],
  arms: [
    {
      name: "Flexions biceps",
      description: "Isolement pour les biceps.",
      image: "https://via.placeholder.com/250x150?text=Bicep+Curls",
    },
    {
      name: "Extensions triceps",
      description: "Isolement pour les triceps.",
      image: "https://via.placeholder.com/250x150?text=Tricep+Extensions",
    },
    {
      name: "Flexions marteau",
      description: "Variations de flexion des biceps.",
      image: "https://via.placeholder.com/250x150?text=Hammer+Curls",
    },
  ],
  core: [
    {
      name: "Gainage",
      description: "Exercice isométrique pour les muscles abdominaux.",
      image: "https://via.placeholder.com/250x150?text=Planks",
    },
    {
      name: "Rotations russes",
      description: "Mouvement rotatif du tronc.",
      image: "https://via.placeholder.com/250x150?text=Russian+Twists",
    },
    {
      name: "Crunchs",
      description: "Exercice abdominal de base.",
      image: "https://via.placeholder.com/250x150?text=Crunches",
    },
  ],
};

function displayExercises(category) {
  const exerciseGrid = document.getElementById("exerciseGrid");
  exerciseGrid.innerHTML = "";

  exercises[category].forEach((exercise) => {
    const card = document.createElement("div");
    card.className = "exercise-card";
    card.innerHTML = `
            <img src="${exercise.image}" alt="${exercise.name}">
            <h3>${exercise.name}</h3>
            <p>${exercise.description}</p>
        `;
    exerciseGrid.appendChild(card);
  });
}

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
  // Plan generator
  const generateBtn = document.getElementById("generateBtn");
  const deleteBtn = document.getElementById("deleteBtn");
  const planDisplay = document.getElementById("planDisplay");

  const storageKey = "savedPlan"; // or "savedPlan_" + (currentUser ? currentUser.email : "guest")

  // Function to load saved plan
  const loadSavedPlan = () => {
    const savedPlan = localStorage.getItem(storageKey);
    if (savedPlan) {
      const plan = JSON.parse(savedPlan);
      displayPlan(plan);
      generateBtn.style.display = "none";
      deleteBtn.style.display = "inline-block";
    } else {
      planDisplay.innerHTML = "";
      generateBtn.style.display = "inline-block";
      deleteBtn.style.display = "none";
    }
  };

  if (generateBtn && deleteBtn) {
    generateBtn.addEventListener("click", () => {
      console.log("userProfile:", userProfile);
      const level = userProfile.fitnessLevel || "beginner";
      console.log("level:", level);
      const plan = generatePlan(level);
      console.log("plan:", plan);
      localStorage.setItem(storageKey, JSON.stringify(plan));
      displayPlan(plan);
      generateBtn.style.display = "none";
      deleteBtn.style.display = "inline-block";
      addPlanToCalendar(plan);
    });

    deleteBtn.addEventListener("click", () => {
      localStorage.removeItem(storageKey);
      const planDates = JSON.parse(localStorage.getItem("planDates")) || [];
      planDates.forEach((dateKey) => {
        delete workouts[dateKey];
      });
      localStorage.setItem("workouts", JSON.stringify(workouts));
      localStorage.removeItem("planDates");
      // 3. LIMPIAR LA UI DEL PLAN
      planDisplay.innerHTML = "";
      // 4. Cambiar botones
      generateBtn.style.display = "inline-block";
      deleteBtn.style.display = "none";
      if (typeof renderCalendar === "function") renderCalendar();
      loadSavedPlan();
    });
    // Load on page load
    loadSavedPlan();
  }

  // Calendar
  const prevMonthBtn = document.getElementById("prevMonth");
  const nextMonthBtn = document.getElementById("nextMonth");
  if (prevMonthBtn && nextMonthBtn) {
    prevMonthBtn.addEventListener("click", () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      renderCalendar();
    });
    nextMonthBtn.addEventListener("click", () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderCalendar();
    });
    renderCalendar();

    // Completion checkbox event listener
    document.addEventListener("change", (e) => {
      if (e.target.classList.contains("completion-checkbox")) {
        const dateKey = e.target.dataset.date;
        completed[dateKey] = e.target.checked;
        localStorage.setItem("completed", JSON.stringify(completed));
        if (document.querySelector(".dashboard")) {
          updateDashboard();
        }
      }
    });
  }

  // Gallery
  const tabBtns = document.querySelectorAll(".tab-btn");
  if (tabBtns.length > 0) {
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        tabBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        displayExercises(btn.dataset.category);
      });
    });
    displayExercises("chest"); // Default category
  }

  // Profile form
  const profileForm = document.getElementById("profileForm");
  if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();
      userProfile = {
        age: document.getElementById("age").value,
        gender: document.getElementById("gender").value,
        height: document.getElementById("height").value,
        weight: document.getElementById("weight").value,
        fitnessLevel: document.getElementById("fitnessLevel").value,
        goals: document.getElementById("goals").value,
        medicalConditions: document.getElementById("medicalConditions").value,
        injuries: document.getElementById("injuries").value,
        equipment: document.getElementById("equipment").value,
      };
      localStorage.setItem("userProfile", JSON.stringify(userProfile));
      document.getElementById("message").textContent =
        "Profile saved successfully!";
    });

    // Load saved profile
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      userProfile = JSON.parse(savedProfile);
      Object.keys(userProfile).forEach((key) => {
        const element = document.getElementById(key);
        if (element) element.value = userProfile[key];
      });
    }
  }

  // Login form
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        document.getElementById("message").textContent =
          "Connexion réussie ! Redirection...";
        setTimeout(() => {
          window.location.href = "profile.html";
        }, 2000);
      } else {
        document.getElementById("message").textContent =
          "Email ou mot de passe incorrect";
      }
    });
  }

  // Check if logged in
  const checkLogin = () => {
    currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser && window.location.pathname.includes("profile.html")) {
      window.location.href = "login.html";
    }
  };
  checkLogin();

  // Load workouts and completed
  workouts = JSON.parse(localStorage.getItem("workouts")) || {};
  completed = JSON.parse(localStorage.getItem("completed")) || {};

  // Update dashboard if on dashboard page
  if (document.querySelector(".dashboard")) {
    updateDashboard();
  }

  // Update navigation based on login status
  const updateNav = () => {
    const navUl = document.querySelector("nav ul");
    if (navUl) {
      const existingLogin = navUl.querySelector(".login-link");
      const existingLogout = navUl.querySelector(".logout-link");
      if (currentUser) {
        if (!existingLogout) {
          const logoutLi = document.createElement("li");
          logoutLi.innerHTML =
            '<a href="#" class="logout-link">Déconnexion</a>';
          navUl.appendChild(logoutLi);
          logoutLi.querySelector("a").addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("currentUser");
            window.location.href = "index.html";
          });
        }
        if (existingLogin) existingLogin.remove();
      } else {
        if (!existingLogin) {
          const loginLi = document.createElement("li");
          loginLi.innerHTML =
            '<a href="login.html" class="login-link">Connexion</a>';
          navUl.appendChild(loginLi);
        }
        if (existingLogout) existingLogout.remove();
      }
    }
  };
  updateNav();
});
