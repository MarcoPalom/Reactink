import React from 'react';
import html2pdf from 'html2pdf.js';

const TodayDate = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString();

  return (
  <h1>{formattedDate}</h1>
  )
};

export default TodayDate;

export const generatePDF = () => {
  const element = document.getElementById('PDFtable');

  const actionColumns = document.querySelectorAll('#PDFtable .action-column');
  actionColumns.forEach((column) => {
    column.classList.add('hidden');
  });

  const options = {
    margin: 0.5, 
    filename: 'Tabla-no:', 
    image: { type: 'jpeg', quality: 0.98 }, 
    html2canvas: { scale: 2 , scrollY:1000}, 
    jsPDF: {
      unit: 'cm', 
      format: 'letter',
      orientation: 'landscape' 
    },
    pagebreak: { mode: 'avoid-all' },
    html2pdf: {
      dpi: 300 
    }
  };

  html2pdf()
    .set(options)
    .from(element)
    .save()
    .then(() => {
      actionColumns.forEach((column) => {
        column.classList.remove('hidden');
      });
    });
};


