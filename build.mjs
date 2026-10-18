import {build} from 'esbuild';
import {cp, mkdir} from 'node:fs/promises';
await mkdir('dist/assets',{recursive:true});
await build({entryPoints:['app.mjs'],bundle:true,format:'esm',platform:'browser',target:'es2022',minify:true,outfile:'dist/assets/app.js'});
await cp('node_modules/pdfjs-dist/build/pdf.worker.min.mjs','dist/assets/pdf.worker.min.mjs');
await cp('node_modules/pdfjs-dist/cmaps','dist/assets/cmaps',{recursive:true});
await cp('node_modules/pdfjs-dist/standard_fonts','dist/assets/standard_fonts',{recursive:true});

// GitHub Pages publishes the root of main; keep a ready-to-serve copy there.
for (const name of ['index.html','style.css','sample.pdf','assets','.nojekyll']) {
  await cp(`dist/${name}`, name, {recursive:true});
}
