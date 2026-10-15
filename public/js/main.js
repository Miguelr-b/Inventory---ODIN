const root = document.documentElement;

// ---------- Theme ----------
const themeToggle = document.getElementById("theme-toggle");
const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

function getSavedTheme() {
    try {
        return localStorage.getItem("theme");
    } catch (e) {
        return null;
    }
}

themeToggle.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
        localStorage.setItem("theme", next);
    } catch (e) {}
});

// While the user hasn't chosen a theme, follow the system if it changes
systemDark.addEventListener("change", (event) => {
    if (!getSavedTheme()) {
        root.dataset.theme = event.matches ? "dark" : "light";
    }
});

// ---------- Search ----------
const searchForm = document.getElementById("search-form");
const searchInput = searchForm.querySelector("input");
const searchButton = searchForm.querySelector("button");

function setSearchOpen(open) {
    searchForm.classList.toggle("open", open);
    searchButton.setAttribute("aria-expanded", open);
    if (open) searchInput.focus();
}

searchButton.addEventListener("click", () => {
    if (!searchForm.classList.contains("open")) {
        setSearchOpen(true);
    } else if (searchInput.value.trim()) {
        searchForm.requestSubmit();
    } else {
        setSearchOpen(false);
    }
});

searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        setSearchOpen(false);
        searchButton.focus();
    }
});

// Click outside closes the search, unless there is text typed
document.addEventListener("click", (event) => {
    if (!searchForm.contains(event.target) && !searchInput.value.trim()) {
        setSearchOpen(false);
    }
});