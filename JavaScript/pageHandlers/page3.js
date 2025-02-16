document.addEventListener("DOMContentLoaded", () => {
    const colorPicker = document.getElementById("labels-color-picker");
    const colorWindow = document.getElementById("color-main");

    const confirmColorsButtonFr = document.getElementById("confirm-colors");
    const closeColorButton = document.getElementById("close-color");

    const nextButton = document.getElementById("next-button");
    const nextButton2 = document.getElementById("next-but2");
    const backButton = document.getElementById("back-button");
    const resetButton = document.getElementById("reset-button");

    colorPicker.addEventListener("click", (event) => {
        event.preventDefault();
        colorWindow.style.display = "flex";
    });

    closeColorButton.addEventListener("click", () => {
        colorWindow.style.display = "none";
    });

    confirmColorsButtonFr.addEventListener("click", () => {
        const label1 = document.getElementById("label1-color").value;
        colorPicker.value = label1;
        colorWindow.style.display = "none";
    });

    nextButton.addEventListener("click", () => {
            window.location.href = "../../Assets/HTMLPages/FileResults.html";
    });

    nextButton2.addEventListener("click", () => {
        window.location.href = "../../Assets/HTMLPages/ManualResults.html";
    })

    backButton.addEventListener("click", () => {
        window.location.href = "../../Assets/HTMLPages/page2.html";
    });

    resetButton.addEventListener("click", () => {
        document.getElementById("chart-title").value = "";
        document.getElementById("x-axis").value = "";
        document.getElementById("y-axis").value = "";
        document.getElementById("labels-color-picker").value = "#000000";
        document.getElementById("line-style").value = "solid";
    });

    const saveChartCustomization = () => {
        const chartTitle = document.getElementById('chart-title').value;
        const xLabel = document.getElementById('x-axis').value;
        const yLabel = document.getElementById('y-axis').value;
        const lineStyle = document.getElementById('line-style').value;

        sessionStorage.setItem('chartTitle', chartTitle);
        sessionStorage.setItem('xLabel', xLabel);
        sessionStorage.setItem('yLabel', yLabel);
        sessionStorage.setItem('lineStyle', lineStyle.toLowerCase());

        console.log(xLabel, yLabel, lineStyle); // дебаг
    };

    const colorInputs = document.querySelectorAll('.color-picker input');
    confirmColorsButtonFr.addEventListener('click', () => {
        const selectedColors = Array.from(colorInputs).map(input => input.value);
        sessionStorage.setItem('chartColors', JSON.stringify(selectedColors));
        alert("Colors saved!");
    });

    closeColorButton.addEventListener('click', () => {
        document.getElementById('color-main').style.display = 'none';
    });
});

