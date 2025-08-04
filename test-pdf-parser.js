const pdf = require('pdf-parse');
const fs = require('fs');

async function testPdfParser() {
  try {
    const pdfPath = 'uploads/certificates/1754236434625-certificado.pdf';
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);

    console.log('=== PDF TEXT EXTRACTED ===');
    console.log(data.text);
    console.log('\n=== TESTING REGEX PATTERNS ===');

    // Test workload pattern
    const workloadMatch = data.text.match(/\b(?:com\s+)?carga\s+horária\s+de\s*(\d+)\s*horas?\b/i);
    console.log('Workload match:', workloadMatch);

    // Test date pattern  
    const dateMatch = data.text.match(/(\d+)\s+de\s+(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\s+a\s+(\d+)\s+de\s+(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\s+de\s+(\d{4})/i);
    console.log('Date match:', dateMatch);

    if (dateMatch) {
      const monthNames = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
      const startMonth = monthNames.indexOf(dateMatch[2].toLowerCase()) + 1;
      const endMonth = monthNames.indexOf(dateMatch[4].toLowerCase()) + 1;
      const year = parseInt(dateMatch[5]);
      
      console.log('Parsed dates:', {
        startMonth,
        endMonth, 
        year,
        workload: workloadMatch ? parseInt(workloadMatch[1]) : null
      });
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

testPdfParser();
