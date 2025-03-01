document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("theme-button");

    // Make light mode the default unless dark mode was enabled before
    if (localStorage.getItem("darkMode") === "enabled") {
        applyDarkModeStyles();
    } else {
        applyLightModeStyles();
    }

    // Function to toggle dark mode
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

        elementsToChange.forEach(element => element?.classList.add("dark-mode-bg"));
        textInputs.forEach(input => input?.classList.add("dark-mode-input"));
        buttons.forEach(button => button?.classList.add("dark-mode-bg"));

        toggleButton.innerHTML = "brightness_7";
        document.body.style.setProperty("background", "linear-gradient(90deg, #000000, #373739)", "important");
    }

    function applyLightModeStyles() {
        document.body.classList.remove("dark-mode");
        document.documentElement.classList.remove("dark-mode");

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

        toggleButton.innerHTML = "brightness_4";
        document.body.style.setProperty("background", "linear-gradient(90deg, #0b7fe6, #08a4e6)", "important");
    }

    toggleButton.onclick = ToggleDarkMode;
});
