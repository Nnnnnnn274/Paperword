# Paperword

A PDF-to-Word converter that runs entirely in your browser. Documents are never uploaded.

GitHub Pages: https://nnnnnnn274.github.io/Paperword/

Original Sites host: https://paperword-pdf-converter.rm49tg29zf.chatgpt.site

## Run locally

Use Node.js 22 or newer and npm.

```sh
npm ci
npm run build
npx serve dist
```

Open the local URL printed by the server. The site supports both a domain root and repository subdirectories.

## Verify

```sh
npm test
```

Checks real PDF-to-DOCX conversion, scanned documents without selectable text, and the page limit.

## Project files

- `app.mjs`: file selection, drag-and-drop, conversion progress, and downloads.
- `conversion.mjs`: PDF text extraction and editable DOCX generation.
- `dist/index.html` and `dist/style.css`: website interface and styling.
- `dist/assets/`: built application, PDF worker, character maps, and fonts.
- `dist/sample.pdf`: working sample document.
- `build.mjs`: bundles the application and copies required PDF assets.
- `verify.mjs`: conversion checks.
- `.openai/hosting.json`: existing Sites hosting configuration.

The built `dist` directory is included and can be served directly. After changing JavaScript source, run `npm run build` to refresh its bundled assets. HTML and CSS are edited directly in `dist`.

## Supported documents

Text-based PDFs up to 25 MB and 200 pages. Text, page breaks, and approximate font sizes are preserved. Images, tables, columns, and complex layouts are not reconstructed. Scanned PDFs require OCR in another tool. Password-protected PDFs must be unlocked before conversion.

Generated Word documents use the `.docx` format and open in Microsoft Word, Google Docs, or LibreOffice.

## Publish to GitHub Pages

Pages serves the built files from the root of the `gh-pages` branch. After editing the site:

```sh
npm run build
npm test
git add .
git commit -m "Update site"
git push origin main
git subtree split --prefix dist -b pages-release
git push origin pages-release:gh-pages
git branch -D pages-release
```
