import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

/**
 * Strips non-ASCII characters to avoid pdf-lib standard font crash
 */
export function sanitizeAscii(str: string): string {
  return str.replace(/[^\x00-\x7F]/g, '').trim();
}

/**
 * Applies ASCII student watermark (footer + diagonal phone watermark)
 */
export async function watermarkPdf(
  inputBytes: Uint8Array,
  studentName: string,
  studentPhone: string
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(inputBytes);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const cleanName = sanitizeAscii(studentName.toUpperCase()) || 'STUDENT';
  const cleanPhone = sanitizeAscii(studentPhone) || '0000000000';
  const footerText = `${cleanName} · ${cleanPhone} · VLDD NOTES HUB`;
  const diagonalText = cleanPhone;

  const pages = pdfDoc.getPages();

  for (const page of pages) {
    const { width, height } = page.getSize();

    // 1. Footer line centred at 10px in grey #A8A8A8
    const fontSize = 9;
    const textWidth = font.widthOfTextAtSize(footerText, fontSize);
    page.drawText(footerText, {
      x: (width - textWidth) / 2,
      y: 12,
      size: fontSize,
      font,
      color: rgb(0.66, 0.66, 0.66), // #A8A8A8
    });

    // 2. Large diagonal watermark with phone number at 8% opacity
    const diagonalFontSize = Math.min(width, height) / 8;
    const diagWidth = boldFont.widthOfTextAtSize(diagonalText, diagonalFontSize);
    page.drawText(diagonalText, {
      x: (width - diagWidth) / 2,
      y: height / 2,
      size: diagonalFontSize,
      font: boldFont,
      color: rgb(0.06, 0.42, 0.36), // Deep green at low opacity
      opacity: 0.08,
      rotate: degrees(35),
    });
  }

  return await pdfDoc.save();
}

/**
 * Creates a valid multi-page sample PDF if no source file exists in local storage
 */
export async function createSamplePdf(title: string, pagesCount: number = 5): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  for (let i = 1; i <= Math.min(pagesCount, 10); i++) {
    const page = pdfDoc.addPage([595.28, 841.89]); // A4
    const { width, height } = page.getSize();

    // Header bar
    page.drawRectangle({
      x: 0,
      y: height - 40,
      width,
      height: 40,
      color: rgb(0.06, 0.42, 0.36), // #0F6B5C
    });

    page.drawText('VLDD NOTES HUB — OFFICIAL STUDY MATERIAL', {
      x: 40,
      y: height - 26,
      size: 11,
      font: titleFont,
      color: rgb(1, 1, 1),
    });

    // Page title
    page.drawText(sanitizeAscii(title) || 'VLDD Study Notes', {
      x: 40,
      y: height - 80,
      size: 16,
      font: titleFont,
      color: rgb(0.07, 0.13, 0.11),
    });

    page.drawText(`Chapter Content — Page ${i} of ${pagesCount}`, {
      x: 40,
      y: height - 110,
      size: 12,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });

    // Body content simulation
    const sampleLines = [
      '1. Important definitions and clinical terms related to veterinary anatomy & clinical practice.',
      '2. Key points frequently asked in previous year entrance examinations.',
      '3. High yield revision points categorized subject-wise for comprehensive preparation.',
      '4. Memorize formulas and anatomical landmarks given in official curriculum.',
    ];

    let yOffset = height - 150;
    for (const line of sampleLines) {
      page.drawText(line, {
        x: 40,
        y: yOffset,
        size: 10.5,
        font,
        color: rgb(0.1, 0.1, 0.1),
      });
      yOffset -= 25;
    }
  }

  return await pdfDoc.save();
}

/**
 * Encrypts PDF using qpdf CLI if available
 */
export async function encryptWithQpdf(
  pdfBuffer: Uint8Array,
  userPassword: string
): Promise<Uint8Array> {
  const tmpDir = os.tmpdir();
  const inputPath = path.join(tmpDir, `input_${Date.now()}_${Math.random().toString(36).slice(2)}.pdf`);
  const outputPath = path.join(tmpDir, `output_${Date.now()}_${Math.random().toString(36).slice(2)}.pdf`);
  const ownerSecret = process.env.PDF_OWNER_SECRET || 'VLDD_SUPER_OWNER_SECRET_SECURE_998124';

  await fs.promises.writeFile(inputPath, pdfBuffer);

  try {
    // Run qpdf encryption command as specified in Section 9
    await execFileAsync('qpdf', [
      '--encrypt',
      userPassword,
      ownerSecret,
      '256',
      '--print=full',
      '--modify=none',
      '--extract=n',
      '--',
      inputPath,
      outputPath,
    ]);

    const encryptedBytes = await fs.promises.readFile(outputPath);
    return encryptedBytes;
  } catch (err) {
    // If qpdf is not installed locally on this machine, return watermarked bytes or log
    console.warn('qpdf execution note:', (err as Error).message);
    return pdfBuffer;
  } finally {
    try {
      await fs.promises.unlink(inputPath);
      await fs.promises.unlink(outputPath);
    } catch {}
  }
}
