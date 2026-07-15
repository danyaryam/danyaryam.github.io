const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const revealItems = document.querySelectorAll(".reveal");
const projectMediaItems = document.querySelectorAll(".project-media");
const projectLightbox = document.querySelector(".project-lightbox");
const projectLightboxImage = projectLightbox.querySelector("img");
const projectLightboxClose = projectLightbox.querySelector(".project-lightbox-close");
const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)");

let lastScrollY = window.scrollY;

function updateHeader() {
    const currentScrollY = window.scrollY;
    header.classList.toggle("is-scrolled", currentScrollY > 24);
    header.classList.toggle("is-hidden", currentScrollY > lastScrollY && currentScrollY > 120);
    lastScrollY = Math.max(currentScrollY, 0);
}

function closeMenu() {
    navToggle.classList.remove("is-open");
    navLinks.classList.remove("is-open");
    header.classList.remove("menu-active");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
}

navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", isOpen);
    header.classList.toggle("menu-active", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
});

navLinks.addEventListener("click", (event) => {
    if (event.target === navLinks) {
        closeMenu();
    }
});

navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
});

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

function openProjectPreview(media, isInteractive = false) {
    const image = media.querySelector(".project-preview");
    projectLightboxImage.src = image.currentSrc || image.src;
    projectLightboxImage.alt = image.alt;
    projectLightbox.classList.add("is-visible");
    projectLightbox.classList.toggle("is-interactive", isInteractive);
    projectLightbox.setAttribute("aria-hidden", "false");
}

function closeProjectPreview() {
    projectLightbox.classList.remove("is-visible", "is-interactive");
    projectLightbox.setAttribute("aria-hidden", "true");
}

projectMediaItems.forEach((media) => {
    const image = media.querySelector(".project-preview");
    media.tabIndex = 0;
    media.setAttribute("role", "button");
    media.setAttribute("aria-label", `Perbesar ${image.alt}`);

    media.addEventListener("mouseenter", () => {
        if (supportsHover.matches) openProjectPreview(media);
    });

    media.addEventListener("mouseleave", () => {
        if (supportsHover.matches) closeProjectPreview();
    });

    media.addEventListener("focus", () => openProjectPreview(media));
    media.addEventListener("blur", closeProjectPreview);

    media.addEventListener("click", () => {
        if (!supportsHover.matches) openProjectPreview(media, true);
    });
});

projectLightboxClose.addEventListener("click", closeProjectPreview);
projectLightbox.addEventListener("click", (event) => {
    if (event.target === projectLightbox) closeProjectPreview();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeProjectPreview();
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
