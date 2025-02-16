let inputData = "";

// Отримуємо елемент поля вводу за його ID
const inputField = document.getElementById('chart-title');

if (inputField) {
    inputField.addEventListener('input', function(event) {
        // Оновлюємо змінну inputData значенням, введеним користувачем
        inputData = event.target.value;

        sessionStorage.setItem('TitleOutput', inputData);
    });
} else {
    console.error("Input field not found.");
}
