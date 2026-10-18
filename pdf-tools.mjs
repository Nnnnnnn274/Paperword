import {PDFDocument, degrees, rgb} from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
export async function exportEditedPdf(bytes,states,fontBytes){
 const pdf=await PDFDocument.load(bytes);pdf.registerFontkit(fontkit);
 const font=fontBytes?await pdf.embedFont(fontBytes,{subset:true}):null;
 if(!states.some(s=>!s.removed))throw Error('Keep at least one page in your PDF.');
 for(const state of states){const page=pdf.getPage(state.index);
  for(const note of state.notes){if(!font)throw Error('The annotation font is unavailable. Please try again.');
   const hex=note.color.replace('#','');page.drawText(note.text,{x:note.x,y:note.y,size:note.size,font,rotate:degrees(note.rotation),color:rgb(parseInt(hex.slice(0,2),16)/255,parseInt(hex.slice(2,4),16)/255,parseInt(hex.slice(4,6),16)/255)});}
  page.setRotation(degrees(state.rotation));
 }
 const output=await PDFDocument.create();const kept=states.filter(s=>!s.removed).map(s=>s.index);
 for(const page of await output.copyPages(pdf,kept))output.addPage(page);
 return output.save();
}
export async function mergePdfs(files){
 if(files.length<2)throw Error('Choose at least two PDFs to merge.');
 const output=await PDFDocument.create();let pages=0;
 for(const bytes of files){const source=await PDFDocument.load(bytes);pages+=source.getPageCount();if(pages>200)throw Error('The combined PDF must have 200 pages or fewer.');for(const page of await output.copyPages(source,source.getPageIndices()))output.addPage(page);}
 return output.save();
}
