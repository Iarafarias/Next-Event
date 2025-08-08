const pdf = require('pdf-parse');
const fs = require('fs');

async function testPdfParser() {
  try {
    const pdfPath = 'uploads/certificates/1754236434625-certificado.pdf';
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);

    const workloadMatch = data.text.match(/\b(?:com\s+)?carga\s+horária\s+de\s*(\d+)\s*horas?\b/i);
    const dateMatch = data.text.match(/(\d+)\s+de\s+(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\s+a\s+(\d+)\s+de\s+(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\s+de\s+(\d{4})/i);

    if (dateMatch) {
      const monthNames = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
      const startMonth = monthNames.indexOf(dateMatch[2].toLowerCase()) + 1;
      const endMonth = monthNames.indexOf(dateMatch[4].toLowerCase()) + 1;
      const year = parseInt(dateMatch[5]);
    }

  } catch (error) {
    // Error handling
  }
}

testPdfParser();
