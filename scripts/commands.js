const commandPages = {
  moderation: [
    {
      name: "/ban",
      description: "Ban someone from the server.",
      arguments: "user, reason",
      permissions: "Ban Members",
      aliases: null,
    },
    {
      name: "/kick",
      description: "Kick someone from the server.",
      arguments: "user, reason",
      permissions: "Kick Members",
      aliases: null,
    },
    {
      name: "/role",
      description:
        "Manage roles and permissions. Subcommands for managing roles on users (add/remove) and editing role properties (name, permissions).",
      arguments: "manage add/remove user role, edit name/permissions role",
      permissions: "Manage Roles",
      aliases: null,
    },
    {
      name: "/nuke",
      description: "Duplicate the current channel and delete the original.",
      arguments: "None",
      permissions: "Manage Channels",
      aliases: null,
    },
    {
      name: "/action-limit",
      description: "Configure action limits and whitelists for roles.",
      arguments:
        "enable, disable, set-limit, whitelist-add, whitelist-remove, list-whitelisted-roles, set-log-channel, remove-log-channel",
      permissions: "Owner",
      aliases: null,
    },
  ],
  information: [
    {
      name: "userinfo",
      description: "View information about yourself or a member.",
      arguments: "prefix, user",
      permissions: "Everyone",
      aliases: ";userinfo, ;ui",
    },
    {
      name: "serverinfo",
      description: "View information about the server.",
      arguments: "prefix",
      permissions: "Everyone",
      aliases: ";serverinfo, ;si",
    },
    {
      name: "vanity",
      description: "Manage the server's vanity-role settings.",
      arguments: "None",
      permissions: "Manage Server",
      aliases: null,
    },
  ],
  voicecontrol: [
    {
      name: "/voicecontrol setup",
      description: "Setup the voice control system.",
      arguments: "None",
      permissions: "Administrator",
      aliases: null,
    },
    {
      name: "/voicecontrol destroy",
      description: "Destroy the voice control system.",
      arguments: "None",
      permissions: "Administrator",
      aliases: null,
    },
    {
      name: "accept",
      description: "Accept a user into your voice channel to join.",
      arguments: "prefix, user",
      permissions: "VC Owner",
      aliases: null,
    },
    {
      name: "claim",
      description: "Claim ownership of a voice channel.",
      arguments: "prefix",
      permissions: "VC Owner",
      aliases: null,
    },
    {
      name: "lock",
      description: "Lock the voice channel.",
      arguments: "prefix",
      permissions: "VC Owner",
      aliases: null,
    },
    {
      name: "unlock",
      description: "Unlock the voice channel.",
      arguments: "prefix",
      permissions: "VC Owner",
      aliases: null,
    },
    {
      name: "reject",
      description: "Reject someone from joining your voice channel.",
      arguments: "prefix",
      permissions: "VC Owner",
      aliases: null,
    },
  ],
  utility: [
    {
      name: "help",
      description: "Show help information and available commands.",
      arguments: "None",
      permissions: "Everyone",
      aliases: null,
    },
    {
      name: "/welcome-message",
      description:
        "Manage welcome messages with subcommands to enable (with channel and message) or disable them.",
      arguments: "enable, disable",
      permissions: "Manage Server",
      aliases: null,
    },
    {
      name: "prefix",
      description: "View and change the cash's prefix for the current server.",
      arguments: "view, set",
      permissions: "Administrator",
      aliases: null,
    },
  ],
};

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
