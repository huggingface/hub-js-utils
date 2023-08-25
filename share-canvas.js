async function shareToCommunity(repodID, title, body, canvasID, buttonEleID) {
  const buttonEle = document.getElementById(buttonEleID);
  buttonEle.disabled = true;

  const canvas = document.getElementById(canvasID);
  const canvasBlob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/png")
  );
  const fileName = `share-${Date.now()}.png`;
  const canvasFile = new File([canvasBlob], fileName, {
    type: "image/png",
  });
  const imageUrl = await uploadFile(canvasFile);

  const descriptionMd = `<img src="${imageUrl}">
  
${body}
  `;
  const params = new URLSearchParams({
    title: title,
    description: descriptionMd,
    preview: true,
  });
  window.open(
    `https://huggingface.co/spaces/${repodID}/discussions/new?${params}`,
    "_blank"
  );
  buttonEle.disabled = false;
}
async function uploadFile(file) {
  const UPLOAD_URL = "https://huggingface.co/uploads";
  const response = await fetch(UPLOAD_URL, {
    method: "POST",
    headers: {
      "Content-Type": file.type,
      "X-Requested-With": "XMLHttpRequest",
    },
    body: file,
  });
  const url = await response.text();
  return url;
}

globalThis.shareToCommunity = shareToCommunity;