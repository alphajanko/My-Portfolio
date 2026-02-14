document.addEventListener("DOMContentLoaded", () => {
  // Footer year
  const yearEl = document.getElementById("current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const primaryMenu = document.getElementById("primary-menu");
  if (mobileToggle && primaryMenu) {
    mobileToggle.addEventListener("click", (e) => {
      e.preventDefault();
      primaryMenu.classList.toggle("hidden");
    });
  }

  // Smooth scroll
  document.querySelectorAll("a.nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href") || "";
      if (!href.startsWith("#")) return;
      e.preventDefault();

      const target = document.getElementById(href.slice(1));
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });

      if (primaryMenu && !primaryMenu.classList.contains("hidden") && window.innerWidth < 1024) {
        primaryMenu.classList.add("hidden");
      }
    });
  });

  // Reveal
  const revealObserver = new IntersectionObserver(
    (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
    { threshold: 0.12 }
  );

  function observeNewReveals(root = document) {
    root.querySelectorAll(".reveal").forEach((el) => {
      if (!el.dataset.revealObserved) {
        el.dataset.revealObserved = "true";
        revealObserver.observe(el);
      }
    });
  }

  observeNewReveals();

  // Typewriter
  const typingEl = document.getElementById("typing-role");
  const roles = ["Secure Data Engineering", "Cyber Risk Analytics", "AI/ML Detection Systems", "Audit & Regulatory Data Controls"];
  let roleIndex = 0, charIndex = 0, deleting = false;

  function typeLoop() {
    if (!typingEl) return;
    const current = roles[roleIndex];
    typingEl.textContent = current.slice(0, charIndex);

    if (!deleting) {
      charIndex++;
      if (charIndex > current.length) {
        deleting = true;
        setTimeout(typeLoop, 1100);
        return;
      }
    } else {
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 35 : 55);
  }
  typeLoop();

  // ===============================
  // EXPERIENCE (timeline + expand)
  // ===============================
  const expWrap = document.getElementById("experience-timeline");
  const expData = Array.isArray(window.experienceItems) ? window.experienceItems : [];

  if (expWrap && expData.length) {
    expWrap.innerHTML = `
      <div class="absolute left-[14px] top-0 h-full w-px bg-brand-700/60"></div>
      <div class="space-y-8"></div>
    `;

    const list = expWrap.querySelector(".space-y-8");

    expData.forEach((item, idx) => {
      const card = document.createElement("article");
      card.className = "reveal relative pl-12";

      const highlightsHtml = (item.highlights || [])
        .map((h) => `
          <li class="flex gap-3">
            <span class="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-accent-400"></span>
            <span>${h}</span>
          </li>
        `)
        .join("");

      card.innerHTML = `
        <div class="absolute left-[6px] top-6 h-4 w-4 rounded-full bg-accent-400 ring-4 ring-brand-900"></div>

        <div class="rounded-3xl border border-brand-700 bg-brand-800/60 p-6 transition hover:border-accent-500/60 hover:shadow-glow">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.3em] text-brand-400">${item.period || ""}</p>
              <h3 class="mt-2 text-xl font-semibold text-white">${item.position || ""}</h3>
              <p class="mt-1 text-sm text-brand-300">${item.company || ""} · ${item.location || ""}</p>
            </div>

            <button
              type="button"
              class="exp-toggle mt-2 inline-flex items-center gap-2 self-start rounded-xl border border-brand-700 bg-brand-900/40 px-4 py-2 text-xs font-semibold text-brand-200 transition hover:border-accent-500 hover:text-white"
              aria-expanded="false"
              aria-controls="exp-details-${idx}">
              Details <i class="fa-solid fa-chevron-down text-[10px] transition"></i>
            </button>
          </div>

          <p class="mt-4 text-sm leading-7 text-brand-200">
            ${item.preview || (item.summary && item.summary[0]) || ""}
          </p>

          <div id="exp-details-${idx}" class="exp-details mt-4 hidden rounded-2xl border border-brand-700 bg-brand-900/40 p-5">
            ${item.tagline ? `<p class="text-xs uppercase tracking-[0.3em] text-brand-400">${item.tagline}</p>` : ""}

            ${(item.summary || []).length
              ? `<div class="mt-3 space-y-3">
                  ${(item.summary || []).map((p) => `<p class="text-sm leading-7 text-brand-200">${p}</p>`).join("")}
                </div>`
              : ""}

            ${(item.highlights || []).length
              ? `<ul class="mt-4 space-y-3 text-sm text-brand-200">${highlightsHtml}</ul>`
              : ""}
          </div>
        </div>
      `;

      list.appendChild(card);
    });

    expWrap.querySelectorAll(".exp-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("aria-controls");
        const panel = document.getElementById(id);
        if (!panel) return;

        const isOpen = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!isOpen));
        panel.classList.toggle("hidden");

        const icon = btn.querySelector("i");
        if (icon) icon.classList.toggle("rotate-180");
      });
    });

    observeNewReveals(expWrap);
  }

  // ===============================
  // SKILLS (top 5 + expand)
  // ===============================
  const skillsContainer = document.getElementById("skills-grid");
  const cats = Array.isArray(window.skillCategories) ? window.skillCategories : [];

  if (skillsContainer && cats.length) {
    const DEFAULT_VISIBLE = 5;
    skillsContainer.innerHTML = "";

    const chip = (text) => `
      <span class="skill-chip">${text}</span>
    `;

    cats.forEach((cat, idx) => {
      const items = Array.isArray(cat.items) ? cat.items : [];
      const visible = items.slice(0, DEFAULT_VISIBLE);
      const hidden = items.slice(DEFAULT_VISIBLE);

      const card = document.createElement("article");
      card.className = "reveal skill-card";

      card.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent-500/30 bg-accent-500/10 text-accent-200">
            <i class="${cat.icon || ""}"></i>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-white">${cat.title || ""}</h3>
            <p class="mt-1 text-xs text-brand-400">${items.length} skills</p>
          </div>
        </div>

        <div class="mt-5 flex flex-wrap gap-2">
          ${visible.map(chip).join("")}
        </div>

        ${hidden.length ? `
          <div id="skills-more-${idx}" class="mt-3 hidden flex flex-wrap gap-2">
            ${hidden.map(chip).join("")}
          </div>

          <button type="button"
            class="skills-toggle mt-5 inline-flex items-center gap-2 rounded-xl border border-brand-700 bg-brand-900/40 px-4 py-2 text-xs font-semibold text-brand-200 transition hover:border-accent-500 hover:text-white"
            data-target="skills-more-${idx}"
            data-hidden-count="${hidden.length}"
            aria-expanded="false">
            +${hidden.length} more
            <i class="fa-solid fa-chevron-down text-[10px] transition"></i>
          </button>
        ` : ""}
      `;

      skillsContainer.appendChild(card);
    });

    skillsContainer.querySelectorAll(".skills-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-target");
        const panel = document.getElementById(targetId);
        if (!panel) return;

        const isOpen = btn.getAttribute("aria-expanded") === "true";
        const hiddenCount = btn.getAttribute("data-hidden-count");

        btn.setAttribute("aria-expanded", String(!isOpen));
        panel.classList.toggle("hidden");

        btn.childNodes[0].nodeValue = isOpen ? `+${hiddenCount} more ` : "Show less ";
        const icon = btn.querySelector("i");
        if (icon) icon.classList.toggle("rotate-180");
      });
    });

    observeNewReveals(skillsContainer);
  }

  // ===============================
  // PROJECTS (grid + modal)
  // ===============================
  const projectsTrack = document.getElementById("projects-carousel");
  const projectItems = Array.isArray(window.projectItems) ? window.projectItems : [];

  function escapeHtml(str = "") {
    return String(str).replace(/[&<>"']/g, (m) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[m]));
  }

  function projectCard(p, idx) {
    const tags = (p.tags || []).slice(0, 3).map(t => `<span class="proj-tag">${escapeHtml(t)}</span>`).join("");
    return `
      <article class="reveal proj-card" data-project-index="${idx}" role="button" tabindex="0"
        aria-label="Open project details: ${escapeHtml(p.title)}">
        <div class="proj-media">
          <img src="${p.image}" alt="${escapeHtml(p.title)}" loading="lazy"/>
          <div class="proj-gradient"></div>

          <div class="proj-meta">
            <p class="proj-period">${escapeHtml(p.period || "")}</p>
            <h3 class="proj-title">${escapeHtml(p.title)}</h3>
            <p class="proj-desc">${escapeHtml(p.description || "")}</p>
            <div class="proj-tags">${tags}</div>
            <div class="proj-foot">
              <span class="proj-hint">Click for details</span>
              <span class="proj-icon"><i class="fa-solid fa-arrow-up-right-from-square"></i></span>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  function buildProjectModal() {
    if (document.getElementById("project-modal")) return;

    const modal = document.createElement("div");
    modal.id = "project-modal";
    modal.className = "fixed inset-0 z-[999] hidden";

    modal.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-shell">
        <button id="project-modal-close" class="modal-close" aria-label="Close modal">
          <i class="fa-solid fa-xmark"></i>
        </button>
        <div id="project-modal-body" class="modal-body"></div>
      </div>
    `;

    document.body.appendChild(modal);

    const close = () => {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      document.body.classList.remove("modal-lock");
    };

    modal.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-backdrop")) close();
    });

    document.getElementById("project-modal-close").addEventListener("click", close);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  function openProjectModal(p) {
    buildProjectModal();

    const modal = document.getElementById("project-modal");
    const body = document.getElementById("project-modal-body");

    const tags = (p.tags || []).map(t => `<span class="modal-tag">${escapeHtml(t)}</span>`).join("");
    const bullets = (p.focus || []).map(b => `
      <li class="flex gap-3">
        <span class="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-accent-400"></span>
        <span>${escapeHtml(b)}</span>
      </li>
    `).join("");

    body.innerHTML = `
      <p class="text-xs uppercase tracking-[0.3em] text-accent-200">${escapeHtml(p.period || "")}</p>
      <h3 class="mt-3 text-3xl font-heading text-white">${escapeHtml(p.title)}</h3>
      <p class="mt-3 text-sm leading-7 text-brand-200">${escapeHtml(p.description || "")}</p>
      <div class="mt-5 flex flex-wrap gap-2">${tags}</div>
      <div class="mt-6 overflow-hidden rounded-3xl border border-brand-700 bg-brand-800/50">
        <img src="${p.image}" alt="${escapeHtml(p.title)}" class="h-64 w-full object-cover"/>
      </div>
      <h4 class="mt-7 text-sm font-semibold text-white">Key contributions</h4>
      <ul class="mt-3 space-y-3 text-sm text-brand-200">${bullets}</ul>
    `;

    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.classList.add("modal-lock");
  }

  if (projectsTrack && projectItems.length) {
    projectsTrack.innerHTML = projectItems.map(projectCard).join("");
    observeNewReveals(projectsTrack);

    projectsTrack.querySelectorAll("[data-project-index]").forEach((card) => {
      const idx = Number(card.getAttribute("data-project-index"));
      const p = projectItems[idx];
      card.addEventListener("click", () => openProjectModal(p));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openProjectModal(p);
        }
      });
    });
  }

  // ===============================
  // EDUCATION (Vertical Timeline)
  // ===============================
  (function renderEducation() {
    const educationList = document.getElementById("education-list");
    const items = window.educationItems || [];

    if (!educationList || !items.length) return;

    educationList.className = "grid gap-6";

    educationList.innerHTML = items
      .map((item, idx) => {
        const isLast = idx === items.length - 1;

        return `
          <article class="edu-item relative pl-12">
            ${!isLast ? `<span class="edu-line" aria-hidden="true"></span>` : ""}
            <span class="edu-dot" aria-hidden="true"></span>

            <div class="edu-card">
              <p class="edu-period">${item.period}</p>

              <div class="edu-row">
                <h3 class="edu-degree">${item.degree}</h3>
                ${item.level ? `<span class="edu-pill">${item.level}</span>` : ""}
              </div>

              <p class="edu-school">${item.institution}</p>
              <p class="edu-location">${item.location}</p>
            </div>
          </article>
        `;
      })
      .join("");
  })();

}); 

// ===============================
// CERTIFICATIONS (Feature Cards + Open Link)
// ===============================
(function renderCertifications() {
  const grid = document.getElementById("certifications-grid");
  const items = window.certificationItems || [];
  if (!grid || !items.length) return;

  const chip = (t) => `<span class="cert-chip">${t}</span>`;

  grid.innerHTML = items.map((c) => {
    const hasUrl = Boolean(c.url && c.url.trim());
    return `
      <article class="reveal cert-feature">
        <div class="cert-icon">
          <i class="${c.icon || "fa-solid fa-certificate"}"></i>
        </div>

        <h3 class="cert-title">${c.title}</h3>
        <p class="cert-sub">${c.issuer}${c.date ? ` · ${c.date}` : ""}</p>

        ${c.description ? `<p class="cert-desc">${c.description}</p>` : ""}

        ${(c.skills || []).length
          ? `<div class="cert-chips">${(c.skills || []).slice(0, 3).map(chip).join("")}</div>`
          : ""}

        <div class="cert-actions">
          <a
            class="cert-btn ${hasUrl ? "" : "is-disabled"}"
            href="${hasUrl ? c.url : "javascript:void(0)"}"
            target="_blank"
            rel="noopener"
            ${hasUrl ? "" : 'aria-disabled="true" tabindex="-1"'}
          >
            View Certificate <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        </div>
      </article>
    `;
  }).join("");

  observeNewReveals(grid);
})();

// ===============================
// NAV ACTIVE LINK ON SCROLL
// ===============================
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav2");

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const id = entry.target.getAttribute("id");

      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${id}`) {
          link.classList.add("active");
        }
      });
    });
  },
  {
    root: null,
    rootMargin: "-40% 0px -50% 0px",
    threshold: 0
  }
);

sections.forEach((section) => {
  navObserver.observe(section);
});
