// commands.js
const commandPages = {
  rng: [
    {
      name: "roll",
      description: "Generates a random title based on rarity chances.",
      arguments: "None",
      permissions: "Everyone",
      aliases: ";roll, ;r",
    },
    {
      name: "leaderboard",
      description: "Displays top users by rarest rolls and roll count.",
      arguments: "scope, limit",
      permissions: "Everyone",
      aliases: null,
    },
    {
      name: "title",
      description: "Displays all titles you can obtain.",
      arguments: "None",
      permissions: "Everyone",
      aliases: null,
    },
    {
      name: "gear view",
      description: "Generates a random title based on rarity chances.",
      arguments: "None",
      permissions: "Everyone",
      aliases: null,
    },
    {
      name: "gear equip",
      description: "Displays top users by rarest rolls and roll count.",
      arguments: "scope, limit",
      permissions: "Everyone",
      aliases: null,
    },
    {
      name: "gear unequip",
      description: "Displays all titles you can obtain.",
      arguments: "None",
      permissions: "Everyone",
      aliases: null,
    },
    {
      name: "favourite-title",
      description: "Favourite a title you own.",
      arguments: "None",
      permissions: "Everyone",
      aliases: null,
    },
    {
      name: "unfavourite-title",
      description: "Unfavourite a title you have favourited.",
      arguments: "None",
      permissions: "Everyone",
      aliases: null,
    },
    {
      name: "collection",
      description: "View your own or someone else's title collection.",
      arguments: "user",
      permissions: "Everyone",
      aliases: null,
    },
    {
      name: "loadout save",
      description: "Save your current equipped gear to a slot.",
      arguments: "None",
      permissions: "Everyone",
      aliases: null,
    },
    {
      name: "loadout load",
      description: "Load a gear slot.",
      arguments: "None",
      permissions: "Everyone",
      aliases: null,
    },
    {
      name: "shop",
      description: "View the rng shop.",
      arguments: "None",
      permissions: "Everyone",
      aliases: null,
    },
  ],
  moderation: [
    {
      name: "ban",
      description: "Ban someone from the server.",
      arguments: "user, reason",
      permissions: "Ban Members",
      aliases: null,
    },
    {
      name: "kick",
      description: "Kick someone from the server.",
      arguments: "user, reason",
      permissions: "Kick Members",
      aliases: null,
    },
    {
      name: "role",
      description: "Discover lots of role managing command options.",
      arguments: "manage, edit",
      permissions: "Manage Roles",
      aliases: null,
    },
  ],
  information: [
    {
      name: "userinfo",
      description: "View information about yourself or a member.",
      arguments: "user",
      permissions: "Everyone",
      aliases: ";userinfo, ;ui",
    },
    {
      name: "serverinfo",
      description: "View information about the server.",
      arguments: "None",
      permissions: "Everyone",
      aliases: ";serverinfo, ;si",
    },
  ],
};

let currentCategory = "rng";

function createCategoryNav() {
  // Remove existing nav if any
  const existingNav = document.getElementById("categoryNav");
  if (existingNav) existingNav.remove();

  const container = document.getElementById("pageContent");
  const nav = document.createElement("div");
  nav.id = "categoryNav";

  // Create buttons for each category key
  Object.keys(commandPages).forEach((category) => {
    const btn = document.createElement("button");
    btn.id = category;
    btn.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    if (category === currentCategory) {
      btn.classList.add("active-category");
    }

    btn.addEventListener("click", () => {
      switchCategory(category);
      // Scroll clicked button smoothly into center
      btn.scrollIntoView({ behavior: "smooth", inline: "center" });
    });

    nav.appendChild(btn);
  });

  // Insert nav before commands grid
  container.parentNode.insertBefore(nav, container);
}

function renderCommands(category) {
  const container = document.getElementById("pageContent");
  container.innerHTML = "";

  const commands = commandPages[category] || [];

  commands.forEach((cmd) => {
    const card = document.createElement("div");
    card.className = "command-card";
    card.innerHTML = `
      <h4>${cmd.name}</h4>
      <p>${cmd.description} <div id="line"></p>
      <p><strong>Arguments:</strong> <br>${cmd.arguments}</p>
      <p><strong>Permissions:</strong> <br>${cmd.permissions}</p>
            ${
              cmd.aliases == null
                ? ""
                : `<p><strong>Aliases:</strong> <br>${cmd.aliases}</p>`
            }
    `;
    container.appendChild(card);
  });
}

function switchCategory(category) {
  currentCategory = category;
  renderCommands(category);

  document.querySelectorAll("#categoryNav button").forEach((btn) => {
    btn.classList.toggle("active-category", btn.id === category);
  });
}

createCategoryNav();
renderCommands(currentCategory);
