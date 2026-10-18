import { Document, Paragraph, TextRun, Packer } from 'docx';
export function pageToParagraphs(items){
 const lines=[];let line=[],lastY=null;
 for(const item of items){if(!('str' in item))continue;const y=item.transform[5];
 if(lastY!==null&&Math.abs(y-lastY)>3&&line.length){lines.push(line);line=[];}
 if(item.str)line.push(item);lastY=y;
 if(item.hasEOL&&line.length){lines.push(line);line=[];lastY=null;}}
 if(line.length)lines.push(line);
 return lines.map(items=>new Paragraph({spacing:{after:90},children:items.map((item,i)=>new TextRun({text:item.str+(i<items.length-1?' ':''),size:Math.max(16,Math.min(64,Math.round(Math.abs(item.height||item.transform[3]||11)*2)))}))}));
}
export async function convertPdf(pdf,onProgress=()=>{}){
 if(pdf.numPages>200)throw Error('This PDF has more than 200 pages. Please split it into smaller files first.');
 const sections=[];let textPages=0;const blankPages=[];
 for(let i=1;i<=pdf.numPages;i++){onProgress(i,pdf.numPages);const page=await pdf.getPage(i);const content=await page.getTextContent();const hasText=content.items.some(x=>x.str?.trim());if(hasText)textPages++;else blankPages.push(i);
 const paragraphs=pageToParagraphs(content.items);sections.push({children:paragraphs.length?paragraphs:[new Paragraph('')]});page.cleanup();}
 if(!textPages)throw Error('No selectable text was found. This may be a scanned PDF. Run OCR on it first, then try again.');
 const doc=new Document({creator:'Paperword',title:'Converted document',sections});
 return {bytes:new Uint8Array(await Packer.toArrayBuffer(doc)),blankPages,textPages};
}
