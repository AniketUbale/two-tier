const statusBadge = document.getElementById("statusBadge");
const summary = document.getElementById("summary");
const stats = document.getElementById("stats");
const taskList = document.getElementById("taskList");
const refreshButton = document.getElementById("refreshButton");
const apiBaseUrl = window.APP_CONFIG?.API_BASE_URL || "/api";

async function loadDashboard() {
  statusBadge.textContent = "Loading";

  try {
    const response = await fetch(`${apiBaseUrl}/dashboard`);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();

    statusBadge.textContent = "Connected";
    summary.textContent = data.summary;

    stats.innerHTML = `
      <article class="stat">
        <span class="stat-label">Tiers</span>
        <strong class="stat-value">${data.stats.tiers}</strong>
      </article>
      <article class="stat">
        <span class="stat-label">Frontend</span>
        <strong class="stat-value">${data.stats.webPort}</strong>
      </article>
      <article class="stat">
        <span class="stat-label">Backend</span>
        <strong class="stat-value">${data.stats.apiPort}</strong>
      </article>
    `;

    taskList.innerHTML = data.tasks
      .map(
        (task) => `
          <li class="task-item">
            <span>${task.title}</span>
            <span class="task-status">${task.status}</span>
          </li>
        `
      )
      .join("");
  } catch (error) {
    statusBadge.textContent = "Offline";
    summary.textContent = "The frontend could not reach the backend tier.";
    stats.innerHTML = "";
    taskList.innerHTML = `<li class="task-item"><span>${error.message}</span><span class="task-status">error</span></li>`;
  }
}

refreshButton.addEventListener("click", loadDashboard);
loadDashboard();
