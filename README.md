# Paperword

A document workspace that runs entirely in your browser. Files are never uploaded.

**Live site:** https://nnnnnnn274.github.io/Paperword/

## Tools

- **PDF to Word:** turn selectable PDF text into editable `.docx` files.
- **PDF editor:** add colored text notes, rotate pages, remove pages, and change page order. Download a new PDF.
- **Word editor:** open `.docx` files or create a document. Edit text, headings, bold, italic, underline, lists, and alignment. Download `.docx` or plain text.
- **PDF merger:** combine up to 10 PDFs and change their order before downloading.

PDF editing adds text annotations; it does not replace existing PDF text. Word import/export simplifies complex formatting and omits images. PDF-to-Word preserves text, page breaks, and approximate font sizes, rather than recreating complex layouts. Scanned PDFs require OCR in another tool. Password-protected PDFs must be unlocked first.

Single PDF and Word files have a 25 MB limit. Merging accepts 50 MB total. PDF tools have a 200-page limit. PDF text notes support Latin, Greek, and Cyrillic characters.

## Run locally

Use Node.js 22 or newer and npm.

```sh
npm ci
npm run build
npx serve .
```

Open the local URL printed by the server. The site works at both a domain root and a repository subdirectory. `dist` is also a standalone static website.

## Verify

```sh
npm test
```

Checks conversion, PDF text annotations, page rotation/removal/reordering, merging, Word export formatting, and UI element references.

Optional end-to-end checks use an existing Chromium installation. Start a local server on port 4173, then run:

```sh
npm run test:browser
```

Set `CHROMIUM_PATH` to your browser executable and `BASE_URL` to another serving URL if needed. The checks exercise document uploads, editing, downloads, and mobile layout.

## Project files

- `app.mjs`: conversion flow and PDF worker configuration.
- `editors.mjs`: tool navigation and PDF, Word, and merge interfaces.
- `conversion.mjs`: PDF text extraction and Word generation.
- `pdf-tools.mjs`: PDF export and merging.
- `word-tools.mjs`: editor content to DOCX export.
- `dist/index.html` and `dist/style.css`: interface and styling.
- `build.mjs`: browser bundle and static asset preparation.
- `verify*.mjs`: document and browser checks.
- `.openai/hosting.json`: original Sites hosting identity; not used by GitHub Pages.

## Publish to GitHub Pages

Pages serves the root of `main`. Edit HTML/CSS in `dist` and JavaScript in the source modules. Run `npm run build` to refresh `dist/assets/app.js` and the ready-to-serve root files. Run `npm test`, commit all changed source and built files, and push `main`. Pages deploys the update automatically.

Keep Settings → Pages set to `main` and `/ (root)`. Documents are processed locally; GitHub Pages only serves the application files. No server, API key, or paid conversion service is needed.
