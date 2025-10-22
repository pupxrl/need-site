// combined.js
const commandPages = {};
let allCommands = [];
let allCommandCards = [];

async function loadCommandData() {
  try {
    const res = await fetch("../commands/index.json");
    if (!res.ok) throw new Error("index.json not found");
    const categories = await res.json();

    allCommands = [];
    const select = document.getElementById("categorySelect");
    if (select) select.innerHTML = `<option value="all">All</option>`;

    for (const category of categories) {
      try {
        const response = await fetch(`../commands/${category}.json`);
        if (!response.ok) throw new Error(`${category}.json not found`);
        const data = await response.json();
        const commandsWithCategory = data.map((cmd) => ({ ...cmd, category }));

        commandPages[category] = commandsWithCategory;
        allCommands.push(...commandsWithCategory);

        if (select) {
          const option = document.createElement("option");
          option.value = category;
          option.textContent =
            category.charAt(0).toUpperCase() + category.slice(1);
          select.appendChild(option);
        }
      } catch (err) {
        console.warn(`Could not load ${category}.json`, err);
        commandPages[category] = [];
      }
    }

    const totalCommands = document.getElementById("totalCommands");
    const totalCategories = document.getElementById("totalCategories");
    if (totalCommands)
      totalCommands.textContent = `${allCommands.length} Commands`;
    if (totalCategories)
      totalCategories.textContent = `${categories.length} Categories`;

    document.dispatchEvent(
      new CustomEvent("commandsLoaded", {
        detail: { commandPages, allCommands },
      })
    );
  } catch (err) {
    console.error("Could not load index.json:", err);
  }
}

function renderCommands(commands) {
  const container = document.getElementById("commandsContainer");
  container.innerHTML = "";

  if (!commands || !commands.length) {
    container.innerHTML = `<p style="text-align:center;color:rgba(234,234,234,0.7);margin-top:2rem;">No commands found.</p>`;
    return;
  }

  commands.forEach((cmd) => {
    const card = document.createElement("div");
    card.className = "command-card";

    const header = document.createElement("div");
    header.className = "command-header";
    header.innerHTML = `<h3>${cmd.name}</h3>`;
    card.appendChild(header);

    const content = document.createElement("div");
    content.className = "command-details hidden";

    if (cmd.description)
      content.innerHTML += `<div class="command-section"><span class="command-label">Description </span><span class="command-value">${cmd.description}</span></div>`;
    if (cmd.arguments)
      content.innerHTML += `<div class="command-section"><span class="command-label">Arguments </span><span class="command-value">${cmd.arguments}</span></div>`;
    if (cmd.permissions)
      content.innerHTML += `<div class="command-section"><span class="command-label">Permissions </span><span class="command-value">${cmd.permissions}</span></div>`;
    if (cmd.aliases)
      content.innerHTML += `<div class="command-section"><span class="command-label">Aliases </span><span class="command-value">${cmd.aliases}</span></div>`;

    content.innerHTML += `<div class="command-section"><span class="command-label">Category </span><span class="command-value">${cmd.category}</span></div>`;
    card.appendChild(content);
    container.appendChild(card);

    header.addEventListener("click", () => {
      content.classList.toggle("hidden");
      card.classList.toggle("expanded");
    });
  });
}

document.addEventListener("commandsLoaded", (e) => {
  const { commandPages, allCommands } = e.detail;
  const dropdownButton = document.getElementById("dropdownButton");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const selectedCategory = document.getElementById("selectedCategory");
  const countAll = document.getElementById("count-all");

  allCommandCards = allCommands;

  if (!dropdownButton || !dropdownMenu) {
    console.error("Dropdown elements not found:", {
      dropdownButton,
      dropdownMenu,
    });
    return;
  }

  console.log(
    "Populating dropdown with categories:",
    Object.keys(commandPages)
  );
  countAll.textContent = allCommands.length;

  dropdownMenu
    .querySelectorAll(".dropdown-item:not([data-value='all'])")
    .forEach((el) => el.remove());

  for (const [category, cmds] of Object.entries(commandPages)) {
    console.log(
      `Adding dropdown item for category: ${category}, Commands: ${cmds.length}`
    );
    const item = document.createElement("div");
    item.className = "dropdown-item";
    item.dataset.value = category;
    item.innerHTML = `
      <i class="fas fa-folder"></i>
      <span>${category.charAt(0).toUpperCase() + category.slice(1)}</span>
      <span class="badge">${cmds.length}</span>`;
    dropdownMenu.appendChild(item);
  }

  console.log("Dropdown menu after population:", dropdownMenu.innerHTML);

  dropdownButton.addEventListener("click", (e) => {
    e.stopPropagation();
    console.log(
      "Dropdown button clicked, toggling menu. Current hidden class:",
      dropdownMenu.classList.contains("hidden")
    );
    dropdownMenu.classList.toggle("hidden");
    dropdownButton.classList.toggle("open");
    console.log(
      "After toggle, hidden class:",
      dropdownMenu.classList.contains("hidden")
    );
  });

  dropdownMenu.addEventListener("click", (e) => {
    const item = e.target.closest(".dropdown-item");
    if (!item) return;

    const category = item.dataset.value;
    selectedCategory.textContent =
      category.charAt(0).toUpperCase() + category.slice(1);
    dropdownMenu.classList.add("hidden");
    dropdownButton.classList.remove("open");

    document.dispatchEvent(
      new CustomEvent("categoryChange", { detail: category })
    );
  });

  document.addEventListener("click", (e) => {
    if (
      !dropdownButton.contains(e.target) &&
      !dropdownMenu.contains(e.target)
    ) {
      dropdownMenu.classList.add("hidden");
      dropdownButton.classList.remove("open");
    }
  });

  const searchInput = document.getElementById("commandSearch");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim().toLowerCase();
    const selectedCategory = document
      .getElementById("selectedCategory")
      .textContent.toLowerCase();

    let filtered = allCommandCards;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((cmd) => cmd.category === selectedCategory);
    }

    if (query) {
      filtered = filtered.filter((cmd) =>
        [cmd.name, cmd.description, cmd.category].some((f) =>
          f?.toLowerCase().includes(query)
        )
      );
    }

    renderCommands(filtered);
  });

  document.addEventListener("categoryChange", () => {
    const query = searchInput.value.trim().toLowerCase();
    const selectedCategory = document
      .getElementById("selectedCategory")
      .textContent.toLowerCase();

    let filtered = allCommandCards;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((cmd) => cmd.category === selectedCategory);
    }

    if (query) {
      filtered = filtered.filter((cmd) =>
        [cmd.name, cmd.description, cmd.category].some((f) =>
          f?.toLowerCase().includes(query)
        )
      );
    }

    renderCommands(filtered);
  });

  document.dispatchEvent(new CustomEvent("categoryChange", { detail: "all" }));
});

document.addEventListener("DOMContentLoaded", loadCommandData);