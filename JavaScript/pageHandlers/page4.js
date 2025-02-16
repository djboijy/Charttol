
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

    // Настроювані значення
    const title = sessionStorage.getItem('TitleOutput') || "Your Chart Name";
    const colors = JSON.parse(sessionStorage.getItem('chartColors')) || ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'];
    const xLabel = sessionStorage.getItem('xLabel') || 'X Axis';
    const yLabel = sessionStorage.getItem('yLabel') || 'Y Axis';

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
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1,
        }],
    };

    new Chart(chartContextFr, {
        type: type,
        data: chartData,
        options: {
            plugins: {
                title: {
                    display: true,
                    text: title,
                    padding: { top: 10, bottom: 30 },
                    font: { size: 25, weight: 'bold', family: 'Arial' },
                    backgroundColor: colors.slice(),
                    borderWidth: 1,
                    borderDash: lineStyleSelect,
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


