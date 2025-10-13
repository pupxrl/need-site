const commandPages = {};

async function loadCommandData() {
  try {
    const res = await fetch("./commands/index.json");
    const categories = await res.json();

    for (const category of categories) {
      try {
        const response = await fetch(`./commands/${category}.json`);
        if (!response.ok) throw new Error(`${category}.json not found`);
        const data = await response.json();
        commandPages[category] = data;

        if (
          !document.querySelector(
            `#categoryNav li[data-category="${category}"]`
          )
        ) {
          const ul = document.querySelector("#categoryNav ul");
          const li = document.createElement("li");
          li.dataset.category = category;
          li.innerHTML = `<a>${
            category.charAt(0).toUpperCase() + category.slice(1)
          }</a>`;
          ul.appendChild(li);
        }

        if (!document.getElementById(category)) {
          const container = document.createElement("div");
          container.id = category;
          container.className =
            "command-category columns is-multiline is-hidden";
          document.querySelector("#commands .container").appendChild(container);
        }
      } catch (err) {
        console.warn(`Could not load ${category}.json:`, err);
        commandPages[category] = [];
      }
    }
  } catch (err) {
    console.error("Could not load index.json:", err);
  }
}

function renderCommandsToSection(category, containerId, searchTerm = "") {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  const commands = commandPages[category] || [];

  const filteredCommands = commands.filter((cmd) =>
    cmd.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!filteredCommands.length) {
    container.innerHTML = `<p style="color: #eaeaea; text-align:center; margin-top:2rem;">No commands found.</p>`;
    return;
  }

  filteredCommands.forEach((cmd) => {
    const card = document.createElement("div");
    card.className = "command-card";

    const sections = [];

    sections.push(`<h3>${cmd.name}</h3>`);

    if (cmd.description) {
      sections.push(`
        <div class="command-section">
          <span class="command-label">Description:</span>
          <span class="command-value">${cmd.description}</span>
        </div>
      `);
    }

    if (cmd.arguments) {
      sections.push(`
        <div class="command-section">
          <span class="command-label">Arguments:</span>
          <span class="command-value">${cmd.arguments}</span>
        </div>
      `);
    }

    if (cmd.permissions) {
      sections.push(`
        <div class="command-section">
          <span class="command-label">Permissions:</span>
          <span class="command-value">${cmd.permissions}</span>
        </div>
      `);
    }

    if (cmd.aliases) {
      sections.push(`
        <div class="command-section">
          <span class="command-label">Aliases:</span>
          <span class="command-value">${cmd.aliases}</span>
        </div>
      `);
    }

    card.innerHTML = sections.join("");

    container.appendChild(card);
  });
}

function initTabs() {
  const tabs = document.querySelectorAll("#categoryNav li");
  const sections = document.querySelectorAll(".command-category");
  const searchInput = document.getElementById("commandSearch");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      searchInput.value = "";

      tabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");

      sections.forEach((section) => section.classList.add("is-hidden"));

      const selected = tab.dataset.category;
      const target = document.getElementById(selected);
      if (target) {
        target.classList.remove("is-hidden");
      }

      renderCommandsToSection(selected, selected);
    });
  });
}

function initSearch() {
  const searchInput = document.getElementById("commandSearch");
  const searchIcon = searchInput.parentElement.querySelector(".icon i");

  searchInput.addEventListener("focus", () => {
    searchIcon.style.color = "#9fc9a3";
  });

  searchInput.addEventListener("blur", () => {
    searchIcon.style.color = "rgba(234, 234, 234, 0.6)";
  });

  searchInput.addEventListener("input", () => {
    const activeTab = document.querySelector("#categoryNav li.is-active");
    if (activeTab) {
      const category = activeTab.dataset.category;
      renderCommandsToSection(category, category, searchInput.value);
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadCommandData();

  ["moderation", "information", "voicecontrol", "utility", "snipe"].forEach(
    (cat) => {
      renderCommandsToSection(cat, cat);
    }
  );

  const sections = document.querySelectorAll(".command-category");
  sections.forEach((section) => section.classList.add("is-hidden"));
  document.getElementById("moderation").classList.remove("is-hidden");

  const tabs = document.querySelectorAll("#categoryNav li");
  tabs.forEach((tab) => tab.classList.remove("is-active"));
  const defaultTab = document.querySelector(
    "#categoryNav li[data-category='moderation']"
  );
  defaultTab.classList.add("is-active");

  initTabs();
  initSearch();
});
