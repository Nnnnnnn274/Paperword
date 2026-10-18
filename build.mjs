import {build} from 'esbuild';
import {cp, mkdir, readFile, writeFile} from 'node:fs/promises';
await mkdir('dist/assets',{recursive:true});
const result=await build({metafile:true,entryNames:'app-[hash]',entryPoints:['app.mjs'],bundle:true,format:'esm',platform:'browser',target:'es2022',minify:true,outdir:'dist/assets'});
const bundle=Object.keys(result.metafile.outputs).find(path=>path.endsWith('.js'));
const filename=bundle.split('/').pop();
const html=await readFile('dist/index.html','utf8');
await writeFile('dist/index.html',html.replace(/src="\.\/assets\/app(?:-[A-Z0-9]+)?\.js"/,`src="./assets/${filename}"`).replace(/href="\.\/style\.css(?:\?v=[^"]*)?"/,`href="./style.css?v=${filename}"`));
await cp('node_modules/pdfjs-dist/build/pdf.worker.min.mjs','dist/assets/pdf.worker.min.mjs');
await cp('node_modules/pdfjs-dist/cmaps','dist/assets/cmaps',{recursive:true});
await cp('node_modules/pdfjs-dist/standard_fonts','dist/assets/standard_fonts',{recursive:true});

// GitHub Pages publishes the root of main; keep a ready-to-serve copy there.
for (const name of ['index.html','style.css','sample.pdf','assets','.nojekyll']) {
  await cp(`dist/${name}`, name, {recursive:true});
}
