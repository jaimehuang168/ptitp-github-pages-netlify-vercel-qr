const contact = {
  fullName: "Ching-Yi Jaime Huang",
  chineseName: "黃進益",
  organization: "Paraguay Synthetic Co., Corp.;Parque Tecnológico Inteligente Taiwán Paraguay;PTITP",
  title: "Gerente / 招商經理 / Investment Promotion Manager",
  phoneDisplay: "+595 984 580 003",
  phoneUri: "+595984580003",
  email: "psc.gerente9.py@gmail.com",
  address: "Mcal. José Félix Estigarribia Km. 302 de la Ruta PY02, Minga Guazú, Alto Paraná, Paraguay",
  fileName: "ching-yi-jaime-huang-ptitp.vcf"
};

const pageUrl = new URL(window.location.href);
pageUrl.hash = "";
const digitalCardUrl = pageUrl.toString();
const googleContactsImportUrl = "https://contacts.google.com/import";

const saveContactButton = document.querySelector("#save-contact");
const downloadQrButton = document.querySelector("#download-qr");
const qrCode = document.querySelector("#qr-code");
const qrStatus = document.querySelector("#qr-status");

// vCard requires line escaping for commas, semicolons, and line breaks.
function escapeVCardValue(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function buildVCard() {
  const addressParts = ["", "", contact.address, "", "", "", "Paraguay"]
    .map(escapeVCardValue)
    .join(";");

  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:Huang;Ching-Yi Jaime;;;`,
    `FN:${escapeVCardValue(`${contact.fullName} ${contact.chineseName}`)}`,
    `ORG:${contact.organization}`,
    `TITLE:${escapeVCardValue(contact.title)}`,
    `TEL;TYPE=CELL,VOICE:${contact.phoneUri}`,
    `TEL;TYPE=WHATSAPP:${contact.phoneUri}`,
    `EMAIL;TYPE=INTERNET:${contact.email}`,
    `ADR;TYPE=WORK:${addressParts}`,
    `URL:${digitalCardUrl}`,
    "END:VCARD"
  ].join("\r\n");
}

function downloadBlob(content, type, fileName) {
  const blob = new Blob([content], { type });
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = blobUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(blobUrl);
}

function saveContact() {
  downloadBlob(buildVCard(), "text/vcard;charset=utf-8", contact.fileName);

  // Google Contacts cannot be written directly without OAuth, so open its vCard import flow.
  window.open(googleContactsImportUrl, "_blank", "noopener");
}

function generateQrCode() {
  if (!window.QRCode || !qrCode) {
    qrStatus.textContent = "QR Code library could not be loaded.";
    return;
  }

  try {
    qrCode.innerHTML = "";

    // qrcode.js renders a lightweight canvas/image directly in the browser.
    new window.QRCode(qrCode, {
      text: digitalCardUrl,
      width: 220,
      height: 220,
      colorDark: "#06223f",
      colorLight: "#ffffff",
      correctLevel: window.QRCode.CorrectLevel.H
    });

    qrStatus.textContent = digitalCardUrl;
  } catch (error) {
    qrStatus.textContent = "QR Code generation failed.";
    console.error(error);
  }
}

function downloadQrCode() {
  const renderedQr = qrCode.querySelector("canvas, img");
  if (!renderedQr) return;

  const link = document.createElement("a");
  link.href = renderedQr.tagName === "CANVAS"
    ? renderedQr.toDataURL("image/png")
    : renderedQr.src;
  link.download = "ptitp-digital-business-card-qr.png";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

saveContactButton.addEventListener("click", saveContact);
downloadQrButton.addEventListener("click", downloadQrCode);
window.addEventListener("DOMContentLoaded", generateQrCode);
