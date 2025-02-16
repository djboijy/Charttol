// На повному завантаженні HTML
document.addEventListener("DOMContentLoaded", function() {
    // Змінні з сторінки
    const fileInput = document.getElementById("file-insert");
    const manualDataInput = document.getElementById("manual-data");

    const nextButton = document.getElementById("next-button");
    const cancelButton = document.getElementById("cancel-button");

    const importedFileName = document.getElementById("chosen-file");
    const fileChosenText = document.getElementById("file-chosen-text");

    // Перевірка чи існують елементи з якими ми працюємо
    if (fileInput && manualDataInput && nextButton && cancelButton) {

        window.onload = function () {
            loadManualData();
            checkData();
        };

        // Завантаження руних даних навіть при перезавантаженні
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
                const fileExtension = file.name.split(".").pop();

                let filenameDisplay = file.name;

                // Якщо ім'я завелике
                if (file.name.length > 20) {
                    filenameDisplay = file.name.slice(0, 17) + "..." + fileExtension;
                }

                importedFileName.textContent = filenameDisplay;

                sessionStorage.setItem("uploadedFile", file.name);
                manualDataInput.value = "";
                sessionStorage.removeItem("manualData");
            } else {
                importedFileName.textContent = "";
                sessionStorage.removeItem("uploadedFile");
            }

            checkData();
        });

        // Збереження ручниз даниз після введення
        manualDataInput.addEventListener("input", () => {
            sessionStorage.setItem("manualData", manualDataInput.value);
            checkData();
        });

        // При переході на наступну сторінку
        nextButton.addEventListener("click", () => {
            const manualData = { labels: [], values: [] };

            manualDataInput.value.trim().split("\n").forEach(line => { // ПОвне забирання пробілів та іншого
                const parts = line.split(":"); // Розділяємо рядок по двокрапкам для "keyvalue" пари, типу такого

                // Частини - лейбл і число
                const label = parts[0] ? parts[0].trim() : "";
                const value = parts[1] ? parts[1].trim() : "";

                if (label !== "" && value !== "" && !isNaN(value)) { // перевірка
                    manualData.labels.push(label);
                    manualData.values.push(Number(value));
                }
            });

            sessionStorage.setItem("manualDataDict", JSON.stringify(manualData));
            window.location.href = "../../Assets/HTMLPages/page2.html";
        });

        // При відхиленні введення
        cancelButton.addEventListener("click", () => {
            fileInput.value = "";
            manualDataInput.value = "";
            importedFileName.textContent = "";

            sessionStorage.removeItem("manualData");
            sessionStorage.removeItem("manualDataDict");
            sessionStorage.removeItem("uploadedFile");

            checkData();
        });

        // Файл інпут
        fileInput.addEventListener("change", (event) => {
            const file = event.target.files[0];

            if (file) {
                // Управління файлом
                handleFileUpload(file)
                    .then((data) => {
                        localStorage.setItem("chartData", JSON.stringify(data));

                        console.log("Data From File: ", data); // Debug log
                    })

                    .catch((error) => {
                        alert(error);
                    });

            }
        });
    }

    function handleFileUpload(file) {
        return new Promise((fulfill, reject) => {
            const fileReader = new FileReader();

            fileReader.onload = (event) => {
                const content = event.target.result; // вміст файлу, який зчитав FileReader

                const fileExtension = file.name.split('.').pop().toLowerCase();

                // Далі проводиться парсинг
                if (fileExtension === 'csv') {
                    fulfill(parseCSV(content));
                } else if (fileExtension === 'json') {
                    fulfill(parseJSON(content));
                } else if (fileExtension === 'xls' || fileExtension === 'xlsx') {
                    fulfill(parseExcel(content));

                } else {
                    reject('Unsupported file format! Please upload CSV, JSON, or Excel files.');
                }
            };

            fileReader.onerror = () => {
                reject('Error reading file! Please try uploading again.');
            };

            //
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

    function parseExcel(data) {
        return new Promise((fulfill, reject) => {
            try {
                // Читаємо Excel файл
                const arrayReader = XLSX.read(data, { type: 'array' });
                const sheet = arrayReader.Sheets[arrayReader.SheetNames[0]];

                const fileDataRows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

                // Перевіряємо, чи є дані
                if (fileDataRows.length < 2) {
                    reject("No data found in the excel file!");

                    return;
                }

                // Витягуємо дані
                const [header, ...dataRows] = fileDataRows;
                const labels = dataRows.map(row => row[0]);

                // Обробляємо значення
                const values = dataRows.map(row => {
                    const rawValue = row[1];
                    const parsedValue = parseFloat(rawValue.toString().replace(',', '.'));
                    return !isNaN(parsedValue) ? parsedValue : 0;
                });

                console.log("Parsed Excel: ", { labels, values });

                sessionStorage.setItem("chartData", JSON.stringify({ values, labels }));
                fulfill({ labels, values });

            } catch (error) {
                reject('Failed to parse the file! Error: ' + error.message);
            }
        });
    }
});


