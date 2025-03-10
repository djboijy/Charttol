﻿// На повному завантаженні HTML
document.addEventListener("DOMContentLoaded", function() {
    const fileInput = document.getElementById("file-insert");
    const manualDataInput = document.getElementById("manual-data");

    const nextButton = document.getElementById("next-button");
    const cancelButton = document.getElementById("cancel-button");

    const importedFilename = document.getElementById("chosen-file");
    const fileChosenText = document.getElementById("file-chosen-text");

    // Перевірка чи існують елементи з якими ми працюємо
    if (fileInput && manualDataInput && nextButton && cancelButton) {

        window.onload = function () {
            loadManualData();
            checkData();
        };

        // Завантаження ручних даних навіть при перезавантаженні (window.onload())
        function loadManualData() {
            const savedData = sessionStorage.getItem("manualData");

            if (savedData) {
                manualDataInput.value = savedData;
            }
        }

        // Функція для перевірки введених даних
        function checkData() {
            const isFileSelected = fileInput.files.length > 0;

            const isManualDataFilled = manualDataInput.value.trim() !== ""; // трім для видалення пробілів

            // Якщо вибрано файл то очищаємо дані інпуту вручну
            if (isFileSelected) {
                manualDataInput.value = "";
                sessionStorage.removeItem("manualData");
            }

            // Умови для енейблу Next кнопки, кнопки cancel та інпутів
            manualDataInput.disabled = isFileSelected;
            nextButton.disabled = !isFileSelected && !isManualDataFilled;

            cancelButton.style.display = isFileSelected || isManualDataFilled ? "block" : "none";
            fileChosenText.style.display = isFileSelected ? "block" : "none";
        }

        // При переданні файлу
        fileInput.addEventListener("change", () => {
            const file = fileInput.files[0];

            if (file) {
                const fileExt = file.name.split(".").pop();

                let filenameDisplay = file.name;

                // Якщо ім'я завелике (спеціальний випадок - додаток)
                if (file.name.length > 20) {
                    filenameDisplay = file.name.slice(0, 17) + "..." + fileExt;
                }

                importedFilename.textContent = filenameDisplay;

                sessionStorage.setItem("uploadedFile", file.name);
                manualDataInput.value = "";
                sessionStorage.removeItem("manualData");
            } else {
                importedFilename.textContent = "";
                sessionStorage.removeItem("uploadedFile");
            }

            checkData();
        });

        // Збереження ручних даних після введення
        manualDataInput.addEventListener("input", () => {
            sessionStorage.setItem("manualData", manualDataInput.value);
            checkData();
        });

        // При переході на наступну сторінку
        nextButton.addEventListener("click", () => {
            const manualData = { labels: [], values: [] };

            manualDataInput.value.trim().split("\n").forEach(line => { // ПОвне забирання пробілів та рядкових відступів
                const parts = line.split(":"); // Розділяємо рядок по двокрапкам для "keyvalue" пари

                // Частини - лейбл і число(значення)
                const label = parts[0] ? parts[0].trim() : ""; // Що іде ПЕРЕД двокрапкою
                const value = parts[1] ? parts[1].trim() : ""; // Що іде ПІСЛЯ двокрапки

                if (label !== "" && value !== "" && !isNaN(value)) { // перевірка
                    manualData.labels.push(label);
                    manualData.values.push(Number(value)); // +конверт в число
                }
            });

            sessionStorage.setItem("manualDataDict", JSON.stringify(manualData)); //
            window.location.href = "../../Assets/HTMLPages/page2.html";
        });

        // При відхиленні введення
        cancelButton.addEventListener("click", () => {
            fileInput.value = "";
            manualDataInput.value = "";
            importedFilename.textContent = "";

            sessionStorage.removeItem("manualData");
            sessionStorage.removeItem("manualDataDict");
            sessionStorage.removeItem("uploadedFile");

            checkData();
        });

        fileInput.addEventListener("change", async (event) => {
            const file = event.target.files[0]; // Підвантажений файл

            if (file) {
                try {
                    const data = await handleFileUpload(file); // Обробка файлу з нашою функцією
                    localStorage.setItem("chartData", JSON.stringify(data)); // Збереження даних з чарту.

                    console.log("Data From File: ", data);
                } catch (error) {
                    alert("Error while processing your file! " + error);
                }
            }
            else {
                alert("Please, choose a file!")
            }
        });
    }

    function handleFileUpload(file) {
        return new Promise((fulfill, reject) => {
            const fileReader = new FileReader();

            fileReader.onload = function(event) {
                let arrayBuffer = event.target.result

                const fileExt = file.name.split('.').pop().toLowerCase();

                // Далі проводиться парсинг
                if (fileExt === 'csv') {
                    fulfill(parseCSV(arrayBuffer));
                } else if (fileExt === 'json') {
                    fulfill(parseJSON(arrayBuffer));

                } else {
                    reject('Unsupported file format! Please upload CSV, JSON, or Excel files.');
                }
            };

            fileReader.onerror = () => {
                reject('Error reading file! Please try uploading again.');
            };

            // Почати зчитування вмісту якщо в нас excel файл
            if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
                fileReader.readAsArrayBuffer(file);
            } else {
                fileReader.readAsText(file);
            }
        });
    }

    // Парсинг CSV
    function parseCSV(content) {
        return new Promise((fulfill, reject) => {
            Papa.parse(content, {
                header: true,
                skipEmptyLines: true,
                complete: function(results) {
                    console.log("CSV Parsing Results: ", results);

                    const readFileChartData = {
                        labels: [],
                        values: []
                    };

                    results.data.forEach(item => {
                        const label = (item.databaseLabel || "").trim(); // Вибір лейбла
                        const value = item.Value.trim(); // Вибір значення, обов'язково як текст

                        if (label !== "" && value !== "") {
                            readFileChartData.labels.push(label);
                            readFileChartData.values.push(value); // Не конвертуємо в число, бо може бути текст
                        } else {
                            console.warn(`Skipping invalid label or value: ${label} / ${value}`);
                        }
                    });

                    console.log("Chart Data to store found! it's: ", readFileChartData);

                    localStorage.setItem("readFileChartData", JSON.stringify(readFileChartData));
                    fulfill(readFileChartData);
                },
                error: function(error) {
                    reject('Error parsing CSV: ', error);
                }
            });
        });
    }

    function parseJSON(data) {
        return new Promise((fulfill, reject) => {
            try {
                const jsonData = JSON.parse(data);

                let labels = [];
                let values = [];

                if (Array.isArray(jsonData)) {
                    labels = jsonData.map(item => item.databaseLabel || item.label);
                    values = jsonData.map(item => parseFloat(item.Value || item.value) || 0); // конвертуємо в 0 якщо не число
                } else if (jsonData.data && Array.isArray(jsonData.data)) {
                    labels = jsonData.data.map(item => item.databaseLabel || item.label);
                    values = jsonData.data.map(item => parseFloat(item.Value || item.value) || 0);
                }

                // Перевірка на категорії в джсон файлі
                else if (jsonData.categories && Array.isArray(jsonData.categories)) {
                    labels = jsonData.categories.map(item => item.name || item.category);
                    values = jsonData.categories.map(item => parseFloat(item.count || item.value) || 0);
                } else if (jsonData.subcategories && Array.isArray(jsonData.subcategories)) {
                    labels = jsonData.subcategories.flatMap(sub => sub.items.map(item => item.name || item.label));
                    values = jsonData.subcategories.flatMap(sub => sub.items.map(item => parseFloat(item.value || item.count) || 0));
                }

                // Якщо простенький файл)
                else if (jsonData) {
                    labels = Object.keys(jsonData);
                    values = Object.values(jsonData).map(value => parseFloat(value) || 0);
                }

                if (labels.length && values.length) {
                    sessionStorage.setItem("chartData", JSON.stringify({ labels, values }));

                    fulfill({ labels, values });
                } else {
                    reject("Invalid data: no valid labels or values found. Try again!");
                }

            } catch (error) {
                reject('Invalid JSON format or file! Error: ' + error);
            }
        });
    }

});


