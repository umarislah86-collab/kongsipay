import {cycleRecord,split} from './model.mjs';
export function monthDate(month,day=28){if(!/^\d{4}-\d{2}$/.test(month))throw Error('Pilih bulan yang sah.');const [y,m]=month.split('-').map(Number);if(m<1||m>12||y<2000||y>2100)throw Error('Bulan tidak sah.');return `${month}-${String(Math.min(day,new Date(Date.UTC(y,m,0)).getUTCDate())).padStart(2,'0')}`;}
export function addMonths(month,n){const d=new Date(monthDate(month,1)+'T12:00:00Z');d.setUTCMonth(d.getUTCMonth()+n);return d.toISOString().slice(0,7);}
export function planCycles(sub,{start,end,interval=1,total,perPerson=false,order=sub.memberUids,payerUid,installments=1,dueDay=28}){
  monthDate(start);if(!Number.isInteger(Number(dueDay))||Number(dueDay)<1||Number(dueDay)>31)throw Error('Hari bayaran mesti 1–31.');if(!Number.isSafeInteger(total)||total<1||total>100000000)throw Error('Jumlah tidak sah.');
  if(![1,2,3,6,12].includes(Number(interval)))throw Error('Sela tidak sah.');
  const periods=[];
  if(sub.billingType==='hutang'){if(!Number.isInteger(installments)||installments<1||installments>120)throw Error('Ansuran mestilah 1–120.');if(payerUid===sub.createdBy||!sub.memberUids.includes(payerUid))throw Error('Pilih penghutang.');for(let i=0;i<installments;i++)periods.push(addMonths(start,i));}
  else{monthDate(end);if(end<start)throw Error('Bulan akhir mesti selepas bulan mula.');for(let m=start;m<=end;m=addMonths(m,Number(interval))){periods.push(m);if(periods.length>120)throw Error('Maksimum 120 kitaran setiap pelan.');}}
  if(sub.billingType==='rotation'&&(order.length!==sub.memberUids.length||new Set(order).size!==order.length||order.some(id=>!sub.memberUids.includes(id))))throw Error('Turutan mesti mengandungi semua ahli sekali sahaja.');
  const amounts=sub.billingType==='hutang'?split(total,periods.map((_,i)=>String(i))).map(x=>x.amount):periods.map(()=>perPerson&&sub.billingType==='split'?total*sub.memberUids.length:total);
  return periods.map((month,i)=>{const record=cycleRecord({sub,id:sub.id+'_'+month,total:amounts[i],due:monthDate(month,Number(dueDay)),payerUid:sub.billingType==='rotation'?order[i%order.length]:payerUid});if(sub.billingType==='hutang')record.label=`Ansuran ${i+1}/${periods.length}`;else if(Number(interval)>1){record.endDate=monthDate(addMonths(month,Number(interval)-1),31);record.label=`${month} – ${record.endDate.slice(0,7)}`;}return record;});
}
export function expectedCycle(c,sub,date){if(sub.billingType==='hutang')return true;const day=Number(date.slice(8,10)),cutoff=day>=20?date.slice(0,7):addMonths(date.slice(0,7),-1);return (c.startDate||c.due||'').slice(0,7)<=cutoff;}
