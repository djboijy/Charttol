document.addEventListener('DOMContentLoaded', () => {
    const chartType = document.getElementById('chart-type-selection-bar');
    const nextButton = document.getElementById('next-button');
    const backButton = document.getElementById('back-button');

    if (!chartType) {
        console.error("Error: chart type wasn't entered!");
        return;
    }

    nextButton.disabled = false;

    nextButton.addEventListener('click', () => {
        const chosenChart = chartType.value;
        localStorage.setItem('chartType', chosenChart);
        window.location.href = '../../Assets/HTMLPages/page3.html';
    });

    backButton.addEventListener('click', () => {
        window.location.href = '../../index.html';
    });
});
