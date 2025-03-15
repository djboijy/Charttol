let myChart = null; // Global variable to store the chart instance

window.onload = function () {
    // Видобуваємо наші дані
    const data = localStorage.getItem("chartData");

    if (data) {
        sessionStorage.setItem("isFileSelected", 'true');
        renderChart(JSON.parse(data));
    } else {
        alert("No data found!");
    }

    document.getElementById('back-button').addEventListener('click', function () {
        window.location.href = '../../Assets/HTMLPages/page3.html';
    });
};

function renderChart(data) {
    const chartContextFr = document.getElementById('chart').getContext('2d');

    if (myChart) {
        myChart.destroy();
    }

    // Настроювані значення
    const title = sessionStorage.getItem('TitleOutput') || "Your Chart Name";
    const colors = JSON.parse(sessionStorage.getItem('chartColors')) || [
        'rgba(75, 192, 192, 0.5)',
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)'
    ];
    const borderColors = colors.map(color => color.replace('0.5', '1')); // Генеруємо border кольори, де 1 — повна насиченість
    const xLabel = sessionStorage.getItem('xLabel') || 'X Axis';
    const yLabel = sessionStorage.getItem('yLabel') || 'Y Axis';

    // Встановлення лінійних стилів (solid, dashed, dotted)
    const lineStyles = {
        'solid': [],
        'dashed': [10, 5],
        'dotted': [2, 2]
    };

    const lineStyle = sessionStorage.getItem('lineStyle');
    const lineStyleSelect = lineStyle ? lineStyles[lineStyle.toLowerCase()] : lineStyles.solid;

    let type = localStorage.getItem('chartType') || 'bar';

    const chartData = {
        labels: data.labels,
        datasets: [{
            label: 'Data from File',
            data: data.values,
            backgroundColor: colors, // Виправлено для відповідності стилю
            borderColor: borderColors,
            borderWidth: 2,
            borderDash: lineStyleSelect, // Виправлено стиль ліній
            tension: 0.1,
        }]
    };

    // **Створюємо графік з правильними кольорами та стилями**
    myChart = new Chart(chartContextFr, {
        type: type,
        data: chartData,
        options: {
            plugins: {
                title: {
                    display: true,
                    text: title,
                    padding: { top: 10, bottom: 30 },
                    font: { size: 25, weight: 'bold', family: 'Arial' }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: xLabel,
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: yLabel,
                    }
                }
            }
        }
    });
}
