const commandPages = {};

function renderCommandsToSection(category, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  const commands = commandPages[category] || [];

  commands.forEach((cmd) => {
    const card = document.createElement("div");
    card.className = "column is-one-third";

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

let tabs, sections;

function initTabs() {
  tabs = document.querySelectorAll("#categoryNav li");
  sections = document.querySelectorAll(".command-category");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");

      sections.forEach((section) => section.classList.add("is-hidden"));

      const selected = tab.dataset.category;
      const target = document.getElementById(selected);
      if (target) {
        target.classList.remove("is-hidden");
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCommandsToSection("moderation", "moderation");
  renderCommandsToSection("information", "information");
  renderCommandsToSection("voicecontrol", "voicecontrol");
  renderCommandsToSection("utility", "utility");

  sections = document.querySelectorAll(".command-category");

  sections.forEach((section) => {
    section.classList.add("is-hidden");
  });

  document.getElementById("moderation").classList.remove("is-hidden");

  tabs = document.querySelectorAll("#categoryNav li");
  tabs.forEach((tab) => {
    tab.classList.remove("is-active");
    if (tab.dataset.category === "moderation") {
      tab.classList.add("is-active");
    }
  });

  initTabs();
});
