const fileToDataUrl = async (file) => {
  if (!(file instanceof File)) {
    throw new Error('Arquivo inválido. Deve ser um File.');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('Falha ao converter arquivo em Data URL.'));
        return;
      }
      resolve(result);
    };

    reader.onerror = () => {
      reject(reader.error || new Error('Falha ao ler o arquivo.'));
    };

    reader.readAsDataURL(file);
  });
};

const extractBase64FromDataUrl = (dataUrl) => {
  if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
    throw new Error('Data URL inválido.');
  }

  const commaIndex = dataUrl.indexOf(',');
  if (commaIndex === -1) {
    throw new Error('Data URL inválido.');
  }

  return dataUrl.slice(commaIndex + 1);
};

const buildDataUrlFromBase64 = (base64, mimeType = 'application/octet-stream') => {
  if (typeof base64 !== 'string') {
    throw new Error('Base64 inválido.');
  }

  return `data:${mimeType};base64,${base64}`;
};

window.ImageConverter = {
  fileToDataUrl,
  extractBase64FromDataUrl,
  buildDataUrlFromBase64,
};
