document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("file-insert");
    const manualDataInput = document.getElementById("manual-data");

    const nextButton = document.getElementById("next-button");
    const cancelButton = document.getElementById("cancel-button");

    const importedFilename = document.getElementById("chosen-file");
    const fileChosenText = document.getElementById("file-chosen-text");

    if (fileInput && manualDataInput && nextButton && cancelButton) {
        window.onload = function () {
            loadManualData();
            checkData();
        };

        function loadManualData() {
            const savedData = sessionStorage.getItem("manualData");

            if (savedData) {
                manualDataInput.value = savedData;
            }
        }

        function checkData() {
            const isFileSelected = fileInput.files.length > 0;
            const isManualDataFilled = manualDataInput.value.trim() !== "";

            if (isFileSelected) {
                manualDataInput.value = "";
                sessionStorage.removeItem("manualData");
            }

            manualDataInput.disabled = isFileSelected;
            nextButton.disabled = !isFileSelected && !isManualDataFilled;
            cancelButton.style.display = isFileSelected || isManualDataFilled ? "block" : "none";
            fileChosenText.style.display = isFileSelected ? "block" : "none";
        }

        fileInput.addEventListener("change", async function (event) {
            const file = event.target.files[0];

            if (file) {
                try {
                    const data = await handleFileUpload(file);

                    localStorage.setItem("chartData", JSON.stringify(data));
                    console.log("Parsed Data from File: ", data);
                } catch (error) {
                    alert("Error while processing your file! " + error);
                }
            } else {
                alert("Please, choose a file!");
            }
        });

        manualDataInput.addEventListener("input", function () {
            sessionStorage.setItem("manualData", manualDataInput.value);
            checkData();
        });

        nextButton.addEventListener("click", function () {
            const manualData = { labels: [], values: [] };

            manualDataInput.value.trim().split("\n").forEach(line => {
                const pts = line.split(":");

                const label = pts[0] ? pts[0].trim() : "";
                const value = pts[1] ? pts[1].trim() : "";

                if (label !== "" && value !== "" && !isNaN(value)) {
                    manualData.labels.push(label);
                    manualData.values.push(Number(value));
                }
            });

            sessionStorage.setItem("manualDataDict", JSON.stringify(manualData));
            window.location.href = "../../Assets/HTMLPages/page2.html";
        });

        cancelButton.addEventListener("click", function () {
            fileInput.value = "";
            manualDataInput.value = "";
            importedFilename.textContent = "";

            sessionStorage.removeItem("manualData");
            sessionStorage.removeItem("manualDataDict");
            sessionStorage.removeItem("uploadedFile");

            checkData();
        });
    }

    function handleFileUpload(file) {
        return new Promise((fulfill, reject) => {
            const fileReader = new FileReader();

            fileReader.onload = async function (event) {
                let fileContent = event.target.result;
                const fileExt = file.name.split('.').pop().toLowerCase();

                try {
                    if (fileExt === 'csv') {
                        fulfill(await parseCSV(fileContent));
                    } else if (fileExt === 'json') {
                        fulfill(parseJSON(fileContent));
                    } else if (fileExt === 'xls' || fileExt === 'xlsx') {
                        fulfill(await parseExcel(fileContent));
                    } else if (fileExt === 'txt') {
                        fulfill(parseTXT(fileContent));
                    } else if (fileExt === 'docx') {
                        fulfill(await parseDOCX(file));
                    } else {
                        reject('Unsupported file format! Please upload CSV, JSON, Excel, TXT, or DOCX files.');
                    }
                }
                catch (error) {
                    reject("Parsing failed: " + error.message);
                }
            };

            fileReader.onerror = () => reject('Error reading file! Please try uploading again.');

            if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
                fileReader.readAsArrayBuffer(file);
            } else if (file.name.endsWith('.docx')) {
                fileReader.readAsArrayBuffer(file);
            } else {
                fileReader.readAsText(file);
            } // перевірка 2
        });
    }

    function parseTXT(content) {
        const manualData = { labels: [], values: [] };

        content.trim().split("\n").forEach(line => {
            const pts = line.split(":");

            const label = pts[0] ? pts[0].trim() : "";
            const value = pts[1] ? pts[1].trim() : "";

            if (label !== "" && value !== "" && !isNaN(value)) {
                manualData.labels.push(label);
                manualData.values.push(Number(value));
            }
        });

        return manualData;
    }

    async function parseDOCX(file) {
        return new Promise((fulfill, reject) => {
            const read = new FileReader();

            read.readAsArrayBuffer(file); // Бінарний масив :D

            read.onload = async function (event) {
                try {
                    const arrayBuffer = event.target.result;

                    const res = await window.mammoth.extractRawText({ arrayBuffer });

                    const extractedText = res.value.trim();
                    const manualData = parseTXT(extractedText);

                    fulfill(manualData);
                } catch (error) {
                    reject("Failed to parse DOCX: " + error.message);
                }
            };

            read.onerror = () => reject("Error reading DOCX file.");
        });
    }

    function parseCSV(content) {
        return new Promise((fulfill, reject) => {
            Papa.parse(content, {
                header: true,

                skipEmptyLines: true,
                complete: function (results) {
                    console.log("CSV Parsed: ", results);

                    const labels = [];
                    const values = [];

                    if (results.data.length === 0) {
                        reject("File is empty! Try again.");
                        return;
                    }

                    // Ключ: значення
                    if (results.meta.fields.includes("Key") && results.meta.fields.includes("Value")) {
                        results.data.forEach(row => {
                            if (row.Key && row.Value) {
                                labels.push(row.Key.trim());
                                values.push(parseFloat(row.Value) || 0);
                            }
                        });
                    } else {
                        // Користувався сторонніми джерелами
                        results.data.forEach(item => {
                            const label = (item.Month || item.Label || item.Key || Object.keys(item)[0] || "").trim();
                            const valueKey = Object.keys(item).find(key => !isNaN(parseFloat(item[key])));
                            const value = valueKey ? parseFloat(item[valueKey]) : NaN;

                            if (label !== "" && !isNaN(value)) {
                                labels.push(label);
                                values.push(value);
                            } else {
                                console.warn(`Skipping label or value!`);
                            }
                        });
                    }

                    console.log("Final Parsed data: ", { labels, values });
                    localStorage.setItem("readFileChartData", JSON.stringify({ labels, values }));
                    fulfill({ labels, values });
                },
                error: function (error) {
                    reject('Error parsing CSV: ' + error.message);
                }
            });
        });
    }

    function parseJSON(data) {
        return new Promise((resolve, reject) => {
            try {
                const jsonData = JSON.parse(data);
                let labels = [], values = [];

                if (Array.isArray(jsonData)) {
                    // Якщо JSON - це масив об'єктів
                    labels = jsonData.map(item => getLabel(item));
                    values = jsonData.map(item => getValue(item));
                } else {
                    let dataset = null;

                    for (let key in jsonData) {
                        if (Array.isArray(jsonData[key]) && jsonData[key].every(obj => typeof obj === 'object')) {
                            dataset = jsonData[key];
                            break;
                        }
                    }

                    if (dataset) {
                        // Якщо знайдено набір даних
                        labels = dataset.map(item => getLabel(item));
                        values = dataset.map(item => getValue(item));
                    } else {
                        labels = Object.entries(jsonData).map(entry => entry[0]);
                        values = Object.entries(jsonData).map(entry => parseFloat(entry[1]) || 0);
                    }
                }

                // Видаляємо пусте
                labels = labels.filter(label => label.trim() !== "");
                values = values.filter(value => !isNaN(value));

                if (labels.length && values.length) {
                    sessionStorage.setItem("chartData", JSON.stringify({ labels, values }));
                    resolve({ labels, values });
                } else {
                    reject("Некоректні дані: не знайдено дійсних міток або значень.");
                }

            } catch (error) {
                reject('Некоректний формат JSON! Помилка: ' + error);
            }
        });
    }

    function getLabel(item) {
        return item.Month || item.Label || item.Name || item.Title ||
            item.Category || item.Date || firstKey(item) || "";
    }

    function getValue(item) {
        for (let key in item) {
            let value = parseFloat(item[key]);
            if (!isNaN(value)) return value;
        }
        return NaN;
    }

    function firstKey(object) {
        for (let key in object) {
            return key; // Повертає перший знайдений ключ
        }
        return "";
    }


    function parseExcel(data) {
        return new Promise((fulfill, reject) => {
            try {
                const workbook = XLSX.read(data, { type: 'array' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const fileDataRows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

                if (!fileDataRows.length) {
                    reject("Excel file is empty!");
                    return;
                }

                const labels = [];
                const values = [];

                // хідери
                let headers = fileDataRows[0];
                if (!Array.isArray(headers)) {
                    reject("Invalid Excel format: Missing headers");
                    return;
                }

                // Перевірка де ключ а де значення
                let labelIndex = 0;
                let valueIndex = headers.findIndex(col => col.toLowerCase().includes("value") || col.toLowerCase().includes("amount") || col.toLowerCase().includes("count"));

                if (valueIndex === -1) valueIndex = 1; // Default to second column

                fileDataRows.slice(1).forEach(row => {
                    if (!Array.isArray(row) || row.length < 2) return;

                    const label = row[labelIndex] ? row[labelIndex].toString().trim() : "";
                    const value = parseFloat(row[valueIndex]) || 0;

                    if (label && !isNaN(value)) {
                        labels.push(label);
                        values.push(value);
                    }
                });

                console.log("Parsed Excel: ", { labels, values });
                sessionStorage.setItem("chartData", JSON.stringify({ labels, values }));
                fulfill({ labels, values });

            } catch (error) {
                reject('Failed to parse the Excel file! Error: ' + error.message);
            }
        });
    }

});


