document.addEventListener("DOMContentLoaded", () => {
    const modeToggleButton = document.getElementById("theme-button");

    // Перевірка на режим
    if (localStorage.getItem("darkMode") === "enabled") {
        applyDarkModeStyles();
    } else {
        applyLightModeStyles();
    }

    function ToggleDarkMode() {
        if (document.body.classList.contains("dark-mode")) {
            applyLightModeStyles();
            localStorage.setItem("darkMode", "disabled");
        } else {
            applyDarkModeStyles();
            localStorage.setItem("darkMode", "enabled");
        }
    }

    function applyDarkModeStyles() {
        document.body.classList.add("dark-mode");
        document.documentElement.classList.add("dark-mode");

        const mainTitle = document.getElementById("web-title");
        // Елементи для яких треба змінити CSS
        const elementsToChange = [
            document.getElementById("page-header"),
            document.getElementById("page-header2"),
            document.getElementById("page-header3"),
            document.getElementById("data-chart-final-text"),
            document.getElementById("choose-colors-window-header"),
            document.getElementById("page-content"),
            document.getElementById("chart-options"),
            document.getElementById("file-drop-area"),
            document.getElementById("chart-display"),
            document.getElementById("color-main")
        ];

        const textInputs = document.querySelectorAll("input[type='text'], textarea, select");
        const buttons = document.querySelectorAll(".button");

        elementsToChange.forEach(element => element?.classList.add("dark-mode-bg"));

        textInputs.forEach(input => input?.classList.add("dark-mode-input"));
        buttons.forEach(button => button?.classList.add("dark-mode-bg"));

        modeToggleButton.innerHTML = "brightness_7";
        mainTitle.style.color = "white";
        document.body.style.setProperty("background", "linear-gradient(90deg, #000000, #373739)", "important");
    }

    function applyLightModeStyles() {
        document.body.classList.remove("dark-mode");
        document.documentElement.classList.remove("dark-mode");

        const mainTitle = document.getElementById("web-title");

        const elementsToChange = [
            document.getElementById("web-title"),
            document.getElementById("page-header"),
            document.getElementById("page-header2"),
            document.getElementById("page-header3"),
            document.getElementById("data-chart-final-text"),
            document.getElementById("choose-colors-window-header"),
            document.getElementById("page-content"),
            document.getElementById("chart-options"),
            document.getElementById("file-drop-area"),
            document.getElementById("chart-display"),
            document.getElementById("color-main")
        ];

        const textInputs = document.querySelectorAll("input[type='text'], textarea, select");
        const buttons = document.querySelectorAll(".button");

        elementsToChange?.forEach(element => element?.classList.remove("dark-mode-bg"));
        textInputs.forEach(input => input?.classList.remove("dark-mode-input"));
        buttons.forEach(button => button?.classList.remove("dark-mode-bg"));

        modeToggleButton.innerHTML = "brightness_4";
        mainTitle.removeAttribute("style");
        document.body.style.setProperty("background", "linear-gradient(90deg, #0b7fe6, #08a4e6)", "important");
    }

    modeToggleButton.onclick = ToggleDarkMode; // Присвоюємо кнопці тоглу її функцію
});
