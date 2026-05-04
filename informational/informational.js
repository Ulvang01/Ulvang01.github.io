import skills from "../data/skills.js";
import experience from "../data/experience.js";
import education from "../data/education.js";
import projects from "../data/projects.js";

/* ── skills ── */
function animateBars(root) {
    root.querySelectorAll(".skill-bar__fill").forEach((bar) => {
        bar.style.width = bar.dataset.level + "%";
    });
}

function renderSkills(groups) {
    const container = document.getElementById("skills-container");

    container.innerHTML = groups
        .map(
            (group, i) => `
    <div class="skill-group" data-index="${i}">
      <button class="skill-group__header" aria-expanded="true">
        <span class="skill-group__name">${group.category}</span>
        <span class="skill-group__chevron"></span>
      </button>
      <div class="skill-group__content">
        <div class="skill-group__items">
          ${group.skills
              .map(
                  ({ name, level }) => `
            <div class="skill-item">
              <span class="skill-item__name">${name}</span>
              <div class="skill-bar">
                <div class="skill-bar__fill" data-level="${level}"></div>
              </div>
              <span class="skill-item__level">${level}</span>
            </div>
          `,
              )
              .join("")}
        </div>
      </div>
    </div>
  `,
        )
        .join("");

    container.querySelectorAll(".skill-group__header").forEach((header) => {
        header.addEventListener("click", () => {
            const group = header.closest(".skill-group");
            const collapsed = group.classList.toggle("collapsed");
            header.setAttribute("aria-expanded", String(!collapsed));
        });
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateBars(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 },
    );

    container
        .querySelectorAll(".skill-group")
        .forEach((g) => observer.observe(g));
}

/* ── timeline (experience & education) ── */
function renderTimeline(items, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = items
        .map(
            ({ title, year, location, org, description }) => `
    <article class="timeline-item">
      <div class="timeline-item__meta">
        <span class="timeline-item__date">${year}</span>
        <span class="timeline-item__place">${location}</span>
      </div>
      <div class="timeline-item__body">
        <h3 class="timeline-item__role">${title}</h3>
        ${org ? `<p class="timeline-item__org">${org}</p>` : ""}
        <p class="timeline-item__desc">${description}</p>
      </div>
    </article>
  `,
        )
        .join("");
}

/* ── projects ── */
function renderProjects(items) {
    const container = document.getElementById("projects-container");
    container.innerHTML = `
    <div class="projects-grid">
      ${items
          .map(
              ({ title, description, languages, link, category }) => `
        <div class="project-card-wrapper">
          <a class="project-card project-card--${category}"
             href="${link}" target="_blank" rel="noopener noreferrer">
            <span class="project-card__category">${category}</span>
            <h3 class="project-card__title">${title}</h3>
            <p class="project-card__desc">${description}</p>
            <div class="project-card__footer">
              <div class="project-card__tags">
                ${languages
                    .filter(Boolean)
                    .map((l) => `<span class="tag">${l}</span>`)
                    .join("")}
              </div>
              <span class="project-card__arrow">↗</span>
            </div>
          </a>
        </div>
      `,
          )
          .join("")}
    </div>
  `;

    // desktop hover: freeze wrapper height, expand card via position:absolute
    container.querySelectorAll(".project-card-wrapper").forEach((wrapper) => {
        const card = wrapper.querySelector(".project-card");
        let closeTimer = null;

        wrapper.addEventListener("mouseenter", () => {
            clearTimeout(closeTimer);
            wrapper.classList.remove("project-card-wrapper--collapsing");
            wrapper.style.height = card.offsetHeight + "px";
            wrapper.classList.add("project-card-wrapper--open");
        });

        wrapper.addEventListener("mouseleave", () => {
            wrapper.classList.remove("project-card-wrapper--open");
            wrapper.classList.add("project-card-wrapper--collapsing");
            closeTimer = setTimeout(() => {
                wrapper.classList.remove("project-card-wrapper--collapsing");
                wrapper.style.height = "";
            }, 400);
        });
    });
}

/* ── active nav highlight ── */
function initNav() {
    const links = [...document.querySelectorAll(".top-nav__links a")];
    const sections = links.map((a) =>
        document.querySelector(a.getAttribute("href")),
    );

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const id = entry.target.id;
                links.forEach((a) =>
                    a.classList.toggle(
                        "active",
                        a.getAttribute("href") === `#${id}`,
                    ),
                );
            });
        },
        { rootMargin: "-20% 0px -75% 0px" },
    );

    sections.forEach((s) => s && observer.observe(s));
}

/* ── hide nav on scroll down, reveal on scroll up ── */
function initScrollNav() {
    const nav = document.querySelector(".top-nav");
    if (!nav) return;

    // expose nav height as a CSS variable for padding-top and scroll-margin-top
    const setNavHeight = () =>
        document.documentElement.style.setProperty(
            "--nav-height",
            nav.offsetHeight + "px",
        );
    setNavHeight();
    window.addEventListener("resize", setNavHeight);

    // suppress hide during smooth-scroll triggered by nav link clicks
    let navClickActive = false;
    let navClickTimer = null;

    document.querySelectorAll(".top-nav__links a").forEach((a) => {
        a.addEventListener("click", () => {
            navClickActive = true;
            clearTimeout(navClickTimer);
            // smooth-scroll to any section shouldn't take more than 1s
            navClickTimer = setTimeout(() => {
                navClickActive = false;
            }, 1000);
        });
    });

    let lastY = window.scrollY;
    let ticking = false;

    window.addEventListener(
        "scroll",
        () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const y = window.scrollY;
                const diff = y - lastY;

                if (!navClickActive && diff > 4 && y > nav.offsetHeight) {
                    // scrolling down — hide
                    nav.classList.add("top-nav--hidden");
                } else if (diff < 0) {
                    // any upward movement — show
                    nav.classList.remove("top-nav--hidden");
                }

                lastY = y;
                ticking = false;
            });
        },
        { passive: true },
    );
}

/* ── burger menu ── */
function initBurger() {
    const burger = document.querySelector(".top-nav__burger");
    const navList = document.querySelector(".top-nav__links");
    if (!burger || !navList) return;

    burger.addEventListener("click", () => {
        const open = navList.classList.toggle("open");
        burger.setAttribute("aria-expanded", String(open));
    });

    // close menu when a link is tapped
    navList.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => {
            navList.classList.remove("open");
            burger.setAttribute("aria-expanded", "false");
        });
    });
}

/* ── init ── */
renderSkills(skills);
renderTimeline(experience, "experience-container");
renderTimeline(education, "education-container");
renderProjects(projects);
initNav();
initScrollNav();
initBurger();
