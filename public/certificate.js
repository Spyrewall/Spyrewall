/* Spyrewall CPPS certificate generator.
   Fills the Canva template (A4 landscape, 842.25 x 595.5 pt) with name, issue date and serial.
   Works in the browser (window.PDFLib + window.fontkit) and in Node for testing. */
(function (root) {
  const PAGE_H = 595.5;
  const Y0 = 8.58;              // the template's MediaBox starts at y=8.58, not 0
  // Placeholder boxes measured from the template (top-left origin, in points).
  const BOX = {
    name:   { x: 300, y: 318, w: 450, h: 30 },   // "[ NAME ]" sits above the underline at y=353
    date:   { x: 360, y: 526, w: 80,  h: 28 },   // "[ DATE ]" after "Issue Date :"
    serial: { x: 3,   y: 568, w: 176, h: 27 },   // "Spyrewall/CPPS/001" bottom-left
  };
  const LINE_CENTER_X = 525;   // centre of the name underline (294 to 756)
  const NAME_BASELINE = Y0 + PAGE_H - 344;
  const DATE_X = 361.9, DATE_BASELINE = Y0 + PAGE_H - 546.7, DATE_SIZE = 17.7;
  const SERIAL_X = 5.2, SERIAL_BASELINE = Y0 + PAGE_H - 586.6, SERIAL_SIZE = 16.4;

  async function build(lib, fontkit, templateBytes, fonts, { name, date, serial }) {
    const { PDFDocument, rgb } = lib;
    const doc = await PDFDocument.load(templateBytes);
    doc.registerFontkit(fontkit);
    const serif = await doc.embedFont(fonts.serif, { subset: true });
    const page = doc.getPages()[0];
    const black = rgb(0, 0, 0), white = rgb(1, 1, 1);
    const cover = (b) => page.drawRectangle({ x: b.x, y: Y0 + PAGE_H - b.y - b.h, width: b.w, height: b.h, color: black });
    cover(BOX.name); cover(BOX.date); cover(BOX.serial);

    // Name: largest size up to 26pt that fits the underline
    let size = 26;
    while (size > 12 && serif.widthOfTextAtSize(name, size) > 440) size -= 0.5;
    page.drawText(name, { x: LINE_CENTER_X - serif.widthOfTextAtSize(name, size) / 2, y: NAME_BASELINE, size, font: serif, color: white });
    page.drawText(date, { x: DATE_X, y: DATE_BASELINE, size: DATE_SIZE, font: serif, color: white });
    page.drawText(serial, { x: SERIAL_X, y: SERIAL_BASELINE, size: SERIAL_SIZE, font: serif, color: white });

    doc.setTitle(`CPPS Certificate - ${name}`);
    doc.setAuthor('Spyrewall');
    doc.setSubject(`Certified Phishing Prevention Specialist - ${serial}`);
    return doc.save();
  }

  const api = { build, BOX };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.CPPSCertificate = api;
})(typeof window !== 'undefined' ? window : globalThis);
