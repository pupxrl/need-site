      document.addEventListener("DOMContentLoaded", () => {
        const burger = document.querySelector(".navbar-burger");
        const menu = document.getElementById(burger.dataset.target);
        burger.addEventListener("click", () => {
          burger.classList.toggle("is-active");
          menu.classList.toggle("is-active");
        });

        const navLinks = document.querySelectorAll(".nav-link");
        const sections = {
          landing: document.getElementById("landing"),
          commands: document.getElementById("commands"),
        };

        navLinks.forEach((link) => {
          link.addEventListener("click", () => {
            const target = link.dataset.target;

            for (const key in sections) {
              if (key === target) {
                sections[key].classList.remove("is-hidden");
              } else {
                sections[key].classList.add("is-hidden");
              }
            }

            window.scrollTo({ top: 0, behavior: "smooth" });
          });
        });

        const categoryTabs = document.querySelectorAll("#categoryNav li");
        const categories = document.querySelectorAll(".command-category");

        categoryTabs.forEach((tab) => {
          tab.addEventListener("click", () => {
            categoryTabs.forEach((t) => t.classList.remove("is-active"));
            tab.classList.add("is-active");

            const category = tab.dataset.category;

            categories.forEach((c) => {
              c.classList.toggle("is-hidden", c.id !== category);
            });
          });
        });
      });