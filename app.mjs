import * as pdfjs from 'pdfjs-dist';
import {convertPdf} from './conversion.mjs';
pdfjs.GlobalWorkerOptions.workerSrc='/assets/pdf.worker.min.mjs';
const $=id=>document.getElementById(id);
let selected=null, busy=false, downloadUrl=null;
function status(text,error=false){$('status').textContent=text;$('status').classList.toggle('error',error);}
function reset(){if(busy)return;selected=null;$('file').value='';$('dropzone').hidden=false;$('work-area').hidden=true;$('convert').hidden=false;$('convert').disabled=false;$('download').hidden=true;$('another').hidden=true;$('progress').hidden=true;if(downloadUrl)URL.revokeObjectURL(downloadUrl);downloadUrl=null;}
async function select(file){if(busy||!file)return;reset();$('dropzone').hidden=true;$('work-area').hidden=false;$('filename').textContent=file.name;$('filemeta').textContent=(file.size/1024/1024).toFixed(2)+' MB · PDF document';
 if(!/\.pdf$/i.test(file.name)){status('Please choose a PDF file.',true);$('convert').disabled=true;return;}
 if(file.size>25*1024*1024){status('This file is larger than 25 MB. Please choose a smaller PDF.',true);$('convert').disabled=true;return;}
 if(!file.size){status('This file is empty. Please choose another PDF.',true);$('convert').disabled=true;return;}
 selected=file;status('Ready when you are. Text and page breaks will be preserved; complex layouts and images may change or be omitted.');}
$('choose').onclick=()=>$('file').click();$('file').onchange=e=>select(e.target.files[0]);$('remove').onclick=reset;$('another').onclick=reset;
const zone=$('dropzone');for(const event of ['dragenter','dragover'])zone.addEventListener(event,e=>{e.preventDefault();zone.classList.add('dragging');});for(const event of ['dragleave','drop'])zone.addEventListener(event,e=>{e.preventDefault();zone.classList.remove('dragging');});zone.addEventListener('drop',e=>{if(e.dataTransfer.files.length>1){select(e.dataTransfer.files[0]);status('One PDF at a time: the first file is selected.');}else select(e.dataTransfer.files[0]);});
$('convert').onclick=async()=>{
 if(!selected||busy)return;busy=true;$('convert').disabled=true;$('remove').disabled=true;$('sample').disabled=true;$('progress').hidden=false;let pdf;
 try{status('Opening your PDF…');const data=new Uint8Array(await selected.arrayBuffer());pdf=await pdfjs.getDocument({data,isEvalSupported:false,cMapUrl:"/assets/cmaps/",cMapPacked:true,standardFontDataUrl:"/assets/standard_fonts/"}).promise;
 const result=await convertPdf(pdf,(page,total)=>{status(`Converting page ${page} of ${total}…`);$('progress').value=Math.round(page/total*90);});
 downloadUrl=URL.createObjectURL(new Blob([result.bytes],{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}));$('download').href=downloadUrl;$('download').download=selected.name.replace(/\.pdf$/i,'')+'.docx';$('download').hidden=false;$('convert').hidden=true;$('another').hidden=false;$('progress').value=100;
 status(result.blankPages.length?`Ready to download. ${result.blankPages.length} page(s) had no selectable text and are blank in the Word file. These pages may need OCR. Review the converted document.`:'Your Word document is ready. Download it below and make it yours. Review formatting before sharing.');
 }catch(err){const message=err?.name==='PasswordException'?'This PDF is password-protected. Save an unlocked copy and try again.':err?.name==='InvalidPDFException'?'This PDF could not be read. It may be damaged. Please try another file.':err.message||'Conversion failed. Please try another PDF.';status(message,true);$('convert').disabled=false;}
 finally{if(pdf)await pdf.destroy();busy=false;$('remove').disabled=false;$('sample').disabled=false;$('progress').hidden=true;}
};
$('sample').onclick=async()=>{try{const response=await fetch('/sample.pdf');if(!response.ok)throw Error('Sample unavailable. Please choose your own PDF.');await select(new File([await response.blob()],'a-fresh-start.pdf',{type:'application/pdf'}));$('converter').scrollIntoView({behavior:'smooth',block:'center'});}catch(e){$('dropzone').hidden=true;$('work-area').hidden=false;status(e.message,true);$('convert').disabled=true;}};
window.addEventListener('beforeunload',()=>{if(downloadUrl)URL.revokeObjectURL(downloadUrl);});
