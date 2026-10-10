import {settlement} from './model.mjs';

const iso=d=>d.toISOString().slice(0,10);
export function calendarOccurrences(item,month,today){
 const start=item.eventDate;if(!start)return [];
 if(!item.repeat||item.repeat==='none')return [start];
 const [year,mo,day]=start.split('-').map(Number),dates=new Set([start]);
 const at=(y,m)=>iso(new Date(Date.UTC(y,m-1,Math.min(day,new Date(Date.UTC(y,m,0)).getUTCDate()),12)));
 const [selectedYear,selectedMonth]=month.split('-').map(Number);
 if(item.repeat==='monthly')dates.add(at(selectedYear,selectedMonth));
 else if(selectedMonth===mo)dates.add(at(selectedYear,mo));
 const [nowYear,nowMonth]=today.split('-').map(Number);
 for(let i=0;i<14;i++){const d=new Date(Date.UTC(nowYear,nowMonth-1+i,1,12));if(item.repeat==='monthly'||d.getUTCMonth()+1===mo)dates.add(at(d.getUTCFullYear(),d.getUTCMonth()+1));}
 return [...dates].filter(d=>d>=start).sort();
}

export function personalItems(state,items,uid,events,today){
 const result=(state.charges||[]).filter(c=>c.member===uid&&!c.self).flatMap(c=>{const balance=settlement(c,state.payments||[]).balance;if(!balance)return [];const sub=state.subscriptions.find(s=>s.id===c.subscription);return [{id:c.id,title:sub?.name||'Subscription',detail:c.period,type:'bill',date:c.due,amount:balance,subscriptionId:c.subscription}];});
 for(const x of items.filter(x=>x.status==='active')){
  if(x.kind==='shopping'&&x.assignee===uid)result.push({...x,type:'shopping',date:items.find(e=>e.id===x.eventId)?.eventDate||''});
  if(x.kind==='task'&&x.assignees[x.turn]===uid)result.push({...x,type:'task',date:x.dueDate});
  if(x.kind==='loan'&&x.borrower===uid)result.push({...x,type:'loan',date:x.dueDate,amount:x.loanType==='money'?x.amount-x.returnedCents:null});
  if(x.kind==='expense'&&x.participants.includes(uid)&&!x.settled.includes(uid))result.push({...x,type:'expense',amount:x.shares[uid],date:''});
 }
 const soon=new Date(today+'T12:00:00Z');soon.setUTCDate(soon.getUTCDate()+7);
 for(const e of events.filter(e=>!e.subscription&&['calendarEvent','shoppingEvent','board'].includes(e.kind)&&e.status!=='done'&&e.date>=today&&e.date<=iso(soon)))if(!result.some(x=>x.id===e.id))result.push({...e,type:'event'});
 return result.sort((a,b)=>(a.date||'9999').localeCompare(b.date||'9999')||a.title.localeCompare(b.title));
}

export function searchRecords(state,spaces,items,query){
 const q=String(query||'').trim().toLocaleLowerCase();if(!q)return [];
 const match=x=>[x.title,x.name,x.description,x.notes,x.body,x.quantity,x.label,x.detail].filter(Boolean).join(' ').toLocaleLowerCase().includes(q);
 const subscriptions=(state.subscriptions||[]).flatMap(s=>[{...s,type:'subscription',title:s.name},...(s.cycles||[]).filter(c=>!c.superseded).map(c=>({...c,id:s.id+':'+c.id,title:s.name+' · '+c.label,type:'subscription',subscriptionId:s.id}))]).filter(match);
 return [...subscriptions,...items.filter(x=>x.kind!=='entry'&&match(x)).map(x=>({...x,type:'utility',spaceName:spaces.find(s=>s.id===x.spaceId)?.name||''}))].slice(0,50);
}

export function spaceBackup(space,items,activity,attachments,at=new Date().toISOString()){
 const rows=items.filter(x=>x.spaceId===space.id);
 return {format:'kongsipay-space-backup',version:1,exportedAt:at,currency:'MYR',moneyUnit:'sen',space,items:rows,activity:activity.filter(x=>x.spaceId===space.id),attachments};
}

export function spaceCSV(items){
 const quote=value=>'"'+String(value??'').replaceAll('"','""')+'"';
 const safe=value=>/^[=+\-@\t\r]/.test(String(value??''))?"'"+value:value;
 const rows=[['id','kind','title','status','date','amount_MYR','target_MYR','balance_MYR','quantity','assignee','parent_id']];
 for(const x of items)rows.push([x.id,x.kind,safe(x.title),x.status,x.eventDate||x.dueDate||'',x.amount==null?'':(x.amount/100).toFixed(2),x.target==null?'':(x.target/100).toFixed(2),x.balance==null?'':(x.balance/100).toFixed(2),safe(x.quantity),x.assignee||'',x.eventId||x.fundId||'']);
 return '\ufeff'+rows.map(row=>row.map(quote).join(',')).join('\r\n');
}
