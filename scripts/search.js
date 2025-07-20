const allCommandCards = [];

function collectAllCommands() {
  Object.entries(commandPages).forEach(([category, commands]) => {
    commands.forEach((cmd) => {
      allCommandCards.push({ ...cmd, category });
    });
  });
}

function renderSearchResults(query) {
  const categories = document.querySelectorAll(".command-category");
  const categoryNav = document.getElementById("categoryNav");

  const fadeDuration = 200;

  if (!query) {
    categories.forEach((section) => {
      section.innerHTML = "";
      section.classList.add("is-hidden");
    });

    categoryNav.classList.remove("fade-out", "is-hidden");
    categoryNav.classList.add("fade-in");

    renderCommandsToSection("rng", "rng");

    tabs.forEach((t) => t.classList.remove("is-active"));
    document
      .querySelector("#categoryNav li[data-category='rng']")
      .classList.add("is-active");

    return;
  }

  categoryNav.classList.remove("fade-in");
  categoryNav.classList.add("fade-out");
  setTimeout(() => categoryNav.classList.add("is-hidden"), fadeDuration);

  categories.forEach((section) => {
    section.innerHTML = "";
    section.classList.remove("is-hidden");
  });

  const matched = allCommandCards.filter((cmd) =>
    [cmd.name, cmd.description, cmd.category].some((field) =>
      field.toLowerCase().includes(query)
    )
  );

  matched.forEach((cmd) => {
    const container = document.getElementById(cmd.category);

    if (!container) return;

    const card = document.createElement("div");
    card.className = "column is-one-third fade-in";

    card.innerHTML = `
      <div class="card has-background-dark has-text-white-ter" style="height: 100%;">
        <div class="card-content">
          <h4 class="title is-5 has-text-info">${cmd.name}</h4>
          <p class="mb-2">${cmd.description}</p>
          <p><strong>Arguments:</strong><br>${cmd.arguments}</p>
          <p><strong>Permissions:</strong><br>${cmd.permissions}</p>
          ${
            cmd.aliases
              ? `<p><strong>Aliases:</strong><br>${cmd.aliases}</p>`
              : ""
          }
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

document.getElementById("commandSearch").addEventListener("input", (e) => {
  const query = e.target.value.trim().toLowerCase();
  renderSearchResults(query);
});

collectAllCommands();
