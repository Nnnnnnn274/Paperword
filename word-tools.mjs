import {Document,Paragraph,TextRun,Packer,HeadingLevel,Table,TableRow,TableCell,WidthType,AlignmentType} from 'docx';
function runs(node,style={}){
 if(node.nodeType===3)return node.textContent?[new TextRun({text:node.textContent,...style})]:[];
 if(node.nodeType!==1)return [];
 const tag=node.tagName.toLowerCase();if(tag==='br')return [new TextRun({break:1})];if(tag==='img')return [];
 const next={...style};if(['b','strong'].includes(tag)||node.style?.fontWeight==='bold')next.bold=true;if(['i','em'].includes(tag)||node.style?.fontStyle==='italic')next.italics=true;if(tag==='u'||node.style?.textDecoration?.includes('underline'))next.underline={};if(['s','strike'].includes(tag))next.strike=true;
 return [...node.childNodes].flatMap(child=>runs(child,next));
}
function paragraph(node,{list=false}={}){
 const tag=node.tagName?.toLowerCase();const heading={h1:HeadingLevel.HEADING_1,h2:HeadingLevel.HEADING_2,h3:HeadingLevel.HEADING_3}[tag];
 const alignment={center:AlignmentType.CENTER,right:AlignmentType.RIGHT,justify:AlignmentType.JUSTIFIED}[node.style?.textAlign];
 return new Paragraph({children:runs(node),heading,alignment,spacing:{after:140},...(list?{bullet:{level:0}}:{})});
}
export async function exportWord(root,title='Paperword document'){
 const blocks=[];
 for(const node of root.childNodes){if(node.nodeType===3){if(node.textContent.trim())blocks.push(new Paragraph(node.textContent));continue;}
  const tag=node.tagName?.toLowerCase();
  if(tag==='table'){const rows=[...node.querySelectorAll('tr')].map(tr=>new TableRow({children:[...tr.children].filter(c=>['TD','TH'].includes(c.tagName)).map(cell=>new TableCell({children:[paragraph(cell)]}))}));if(rows.length)blocks.push(new Table({width:{size:100,type:WidthType.PERCENTAGE},rows}));}
  else if(tag==='ul'||tag==='ol'){for(const li of node.children)blocks.push(paragraph(li,{list:true}));}
  else blocks.push(paragraph(node));
 }
 const document=new Document({creator:'Paperword',title,sections:[{children:blocks.length?blocks:[new Paragraph('')]}]});
 return new Uint8Array(await Packer.toArrayBuffer(document));
}
