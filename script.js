const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const revealItems = document.querySelectorAll(".reveal");

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
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
