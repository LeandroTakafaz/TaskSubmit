const arquivoInput = document.getElementById('arquivo');
const filePreview = document.getElementById('file-preview');
const fileName = document.getElementById('file-name');
const removeFileBtn = document.getElementById('remove-file');
const uploadForm = document.getElementById('upload-form');

arquivoInput.addEventListener('change', function () {
    if (arquivoInput.files.length > 0) {
        fileName.textContent = arquivoInput.files[0].name;
        filePreview.style.display = 'flex';
    }
});

removeFileBtn.addEventListener('click', function () {
    arquivoInput.value = '';
    fileName.textContent = '';
    filePreview.style.display = 'none';
});

uploadForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    if (arquivoInput.files.length === 0) {
        alert("Por favor, selecione um arquivo antes de enviar.");
        return;
    }

    const formData = new FormData();
    formData.append('file', arquivoInput.files[0]);

    try {
        const response = await fetch('http://localhost:3000/api/files/upload', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        console.log("Resposta do servidor:", data);

        if (response.ok) {
            arquivoInput.value = '';
            fileName.textContent = '';
            filePreview.style.display = 'none';
        } else {
            console.log(`Erro: ${data.msg}`);
        }
    } catch (error) {
        console.error('Erro ao enviar arquivo:', error);
        alert('Erro ao conectar com o servidor.');
    }
});
