
async function loadDocs() {
  const res = await fetch("../docs.json");
  const data = await res.json();
  const container = document.getElementById("docs-content");
  const sidebar = document.querySelector("#docs-sidebar .menu-list");

  container.innerHTML = "";
  sidebar.innerHTML = "";

  data.categories.forEach(cat => {
    const section = document.createElement("section");
    section.id = cat.id;

    const header = document.createElement("h3");
    header.className = "title is-4";
    header.textContent = cat.title;
    section.appendChild(header);

    const content = document.createElement("div");
    content.className = "section-content";
    content.innerHTML = cat.content.join("\n");
    section.appendChild(content);

    container.appendChild(section);

    // Add to sidebar
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = `#${cat.id}`;
    link.className = "doc-nav-link";
    link.textContent = cat.title;
    li.appendChild(link);
    sidebar.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", loadDocs);
