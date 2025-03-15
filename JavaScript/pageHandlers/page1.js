const fileInput = document.getElementById('file-insert');
const manualDataInput = document.getElementById('manual-data');
const nextButton = document.getElementById('next-button');

function checkData() {
    if (fileInput.files.length > 0 || manualDataInput.value.trim() !== "") {
        nextButton.disabled = false;
    } else {
        nextButton.disabled = true;
    }
}

fileInput.addEventListener('change', checkData);
manualDataInput.addEventListener('input', checkData);

if (fileInput) {
    const nextButton = document.getElementById("next-button");

    nextButton.addEventListener("click", () => {
        const isFileSelected = fileInput.files.length > 0;

        if (isFileSelected) {
            sessionStorage.setItem("fileSelected", 'true');
        } else {
            sessionStorage.setItem("fileSelected", 'false');
        }
    });
} else {
    console.warn('File input element not found.');
}

nextButton.addEventListener('click', () => {
    if (!nextButton.disabled) {
        window.location.href = '../../Assets/HTMLPages/page2.html';
    }
})
