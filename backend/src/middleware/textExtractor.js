const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const extractTextFromPDF = async (filePath) => {
  try {
    const pdfBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(pdfBuffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error;
  }
};

const extractTextFromDOCX = async (filePath) => {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw error;
  }
};

const extractTextFromTXT = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error('Error extracting text from TXT:', error);
    throw error;
  }
};

const extractText = async (filePath, fileType) => {
  switch (fileType.toUpperCase()) {
    case 'PDF':
      return await extractTextFromPDF(filePath);
    case 'DOCX':
      return await extractTextFromDOCX(filePath);
    case 'TXT':
      return extractTextFromTXT(filePath);
    default:
      throw new Error('Unsupported file type');
  }
};

module.exports = { extractText };
