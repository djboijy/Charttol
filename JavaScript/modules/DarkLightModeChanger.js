document.addEventListener("DOMContentLoaded", () => {
    // Кнопка для перемикання
    const toggleButton = document.getElementById("theme-button");

    // Функція для перемикання темного режиму
    function ToggleDarkMode() {
        document.body.classList.toggle("dark-mode");

        // Всі заголовки або просто хідери
        const headerElements = [
            document.getElementById("web-title"),
            document.getElementById("page-header"),
            document.getElementById("page-header2"),
            document.getElementById("page-header3"),
            document.getElementById("data-chart-final-text"),
            document.getElementById("choose-colors-window-header")
        ];

        // Інші об'єкти для зміни при темному режимі
        const bg = document.getElementById("page-content");
        const chartOptions = document.getElementById("chart-options");
        const dropfileThing = document.getElementById("file-drop-area");
        const textInputs = document.querySelectorAll("input[type='text'], textarea, select");
        const buttons = document.querySelectorAll(".button"); // всі кнопки
        const chartDisplay = document.getElementById("chart-display");
        const colorChangeWin = document.getElementById("color-main");

        // Зміна елементів на темний режим(з CSS)
        headerElements.forEach(element => element?.classList.toggle("dark-mode-header"));
        bg?.classList.toggle("file-upload-dark-mode");
        chartOptions?.classList.toggle("dark-mode-bg");
        dropfileThing?.classList.toggle("dark-mode-bg");
        chartDisplay?.classList.toggle("dark-mode-bg");
        colorChangeWin?.classList.toggle("color-win-dark-mode");

        // Зміна всіх інпутів та кнопок з сторінок на темний режим
        buttons.forEach(button => button?.classList.toggle("dark-mode-bg"));
        textInputs.forEach(input => input?.classList.toggle("dark-mode-input"));

        // Зміна іконки кнопки та фону
        if (document.body.classList.contains("dark-mode")) {
            toggleButton.innerHTML = "brightness_7";
            document.body.style.setProperty("background", "linear-gradient(90deg, #000000, #373739)", "important");
            localStorage.setItem("darkMode", "enabled");
        } else {
            toggleButton.innerHTML = "brightness_4";
            document.body.style.setProperty("background", "linear-gradient(90deg, #0b7fe6, #08a4e6)", "important");
            localStorage.setItem("darkMode", "disabled");
        }

    }

    // Якщо в локальному сховищі встановлено "darkMode" як "enabled"
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");

        const headerElements = [
            document.getElementById("web-title"),
            document.getElementById("page-header"),
            document.getElementById("page-header2"),
            document.getElementById("page-header3"),
            document.getElementById("data-chart-final-text"),
            document.getElementById("choose-colors-window-header")
        ];
        const bg = document.getElementById("page-content");
        const chartOptions = document.getElementById("chart-options");
        const dropfileThing = document.getElementById("file-drop-area");
        const textInputs = document.querySelectorAll("input[type='text'], textarea, select");
        const buttons = document.querySelectorAll(".button");
        const chartDisplay = document.getElementById("chart-display");
        const colorChangeWin = document.getElementById("color-main");

        headerElements.forEach(element => element?.classList.add("dark-mode-header"));
        bg?.classList.add("file-upload-dark-mode");
        chartOptions?.classList.add("dark-mode-bg");
        dropfileThing?.classList.add("dark-mode-bg");
        chartDisplay?.classList.add("dark-mode-bg");
        colorChangeWin?.classList.add("color-win-dark-mode");
        buttons.forEach(button => button?.classList.add("dark-mode-bg"));
        textInputs.forEach(input => input?.classList.add("dark-mode-input"));

        toggleButton.innerHTML = "brightness_7";
        document.body.style.setProperty("background", "linear-gradient(90deg, #000000, #373739)", "important");
    } else {
        toggleButton.innerHTML = "brightness_4";
        document.body.style.setProperty("background", "linear-gradient(90deg, #0b7fe6, #08a4e6)", "important");
    }

    toggleButton.onclick = ToggleDarkMode;
});

