import {t,lhtml,currentLanguage} from './i18n.js';
import {jsPDF} from 'jspdf';
import {autoTable} from 'jspdf-autotable';
import {statementRows} from './premium.mjs';
export async function createStatement(state,charges,{title='Penyata bayaran',name='Ahli',date='',logo,fontData}={}){
  const doc=new jsPDF(),font=fontData?'NotoSansJP':'helvetica';if(fontData){doc.addFileToVFS('NotoSansJP.ttf',fontData);doc.addFont('NotoSansJP.ttf',font,'normal');doc.addFont('NotoSansJP.ttf',font,'bold');}const rows=statementRows(state,charges),rm=n=>'RM '+(n/100).toFixed(2);
  const clean=s=>String(s||'').replace(fontData?/[^\x20-\x7E\xA0-\xFF\u3000-\u9FFF\uFF00-\uFFEF]/g:/[^\x20-\x7E\xA0-\xFF]/g,'').slice(0,140);
  doc.setFillColor(17,21,22);doc.rect(0,0,210,55,'F');
  if(logo){try{doc.addImage(logo,'PNG',14,12,15,15);}catch{}}
  doc.setTextColor(255);doc.setFont(font,'bold');doc.setFontSize(18);doc.text('KongsiPay',logo?34:14,22);doc.setFontSize(11);doc.text(clean(title),14,36);doc.setFont(font,'normal');doc.setFontSize(9);doc.setTextColor(205,215,208);doc.text(clean(name)+'  |  '+date,14,45);
  const sums=rows.reduce((a,r)=>{for(const k of ['received','pending','forgiven','balance'])a[k]+=r[k];return a;},{received:0,pending:0,forgiven:0,balance:0});
  doc.setTextColor(30,40,34);doc.setFontSize(10);doc.text(lhtml`Diterima: ${rm(sums.received)}    Dalam semakan: ${rm(sums.pending)}`,14,66);doc.text(lhtml`Dihalalkan: ${rm(sums.forgiven)}    Baki: ${rm(sums.balance)}`,14,73);
  autoTable(doc,{startY:83,head:[['Ahli / penerima','Subscription / bil','Jumlah','Diterima','Halal','Pending','Baki'].map(t)],body:rows.map(r=>[clean(r.member)+'\n'+t('Kepada')+' '+clean(r.payee),clean(r.subscription)+'\n'+clean(r.period)+'\n'+r.due,rm(r.amount),rm(r.received),rm(r.forgiven),rm(r.pending),rm(r.balance)]),styles:{font,fontSize:8,cellPadding:3,overflow:'linebreak'},headStyles:{fillColor:[41,59,46],textColor:[255,255,255]},alternateRowStyles:{fillColor:[245,248,244]},columnStyles:{0:{cellWidth:34},1:{cellWidth:43}},margin:{top:18,bottom:20},didDrawPage:()=>{const page=doc.internal.getCurrentPageInfo().pageNumber;doc.setTextColor(110);doc.setFontSize(8);doc.text('KongsiPay | '+t('Penyata rekod, bukan bukti transaksi bank.'),14,287);doc.text(t('Halaman')+' '+page,180,287);}});
  return doc;
}
export async function downloadStatement(state,charges,options){let logo;try{const r=await fetch(`${import.meta.env.BASE_URL}icons/icon-192.png`);if(r.ok){const blob=await r.blob();logo=await new Promise((resolve,reject)=>{const f=new FileReader();f.onload=()=>resolve(f.result);f.onerror=reject;f.readAsDataURL(blob);});}}catch{}let fontData;if(currentLanguage()==='ja'){const r=await fetch(`${import.meta.env.BASE_URL}fonts/NotoSansJP-Regular.ttf`);if(!r.ok)throw Error('PDF font unavailable');const bytes=new Uint8Array(await r.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));fontData=btoa(binary);}const doc=await createStatement(state,charges,{...options,title:t(options.title),logo,fontData});doc.save('kongsipay-penyata-'+options.date+'.pdf');}
