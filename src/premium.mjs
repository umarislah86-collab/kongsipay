import {t,lhtml} from './i18n.js';
import {settlement,summary,cents} from './model.mjs';
export function monthlyOverview(state,uid,date){
  const month=date.slice(0,7),mine=state.charges.filter(c=>c.member===uid&&!c.self);
  const relevant=mine.filter(c=>{const sub=state.subscriptions.find(s=>s.id===c.subscription),cycle=sub?.cycles.find(b=>b.id===c.cycleId);return (cycle?.startDate||c.due||'').slice(0,7)<=month;});
  const payable=relevant.filter(c=>settlement(c,state.payments).available>0).sort((a,b)=>a.due.localeCompare(b.due));
  const current=relevant.filter(c=>(state.subscriptions.find(s=>s.id===c.subscription)?.cycles.find(b=>b.id===c.cycleId)?.startDate||c.due).slice(0,7)===month);
  const total=summary(state,relevant);
  return {month,relevant,current,payable,next:payable[0],...total,available:Math.max(0,total.outstanding-total.pending),overdue:summary(state,relevant.filter(c=>c.due<date)).outstanding,future:summary(state,mine.filter(c=>!relevant.includes(c))).outstanding};
}
export function billTimeline(state,charge){
  const sub=state.subscriptions.find(s=>s.id===charge.subscription),cycle=sub?.cycles.find(c=>c.id===charge.cycleId),events=[];
  if(cycle?.providerPaidAt)events.push({id:'provider',kind:'provider',date:cycle.providerPaidAt,text:t('Owner membayar bil provider'),amount:providerAmount(cycle)||0,providerProof:cycle.hasProviderProof,cycleId:cycle.id});
  if(cycle)events.push({id:'cycle',kind:'created',date:cycle.createdAt||0,text:t('Bil dijana'),amount:charge.amount});
  for(const p of state.payments.filter(p=>p.cycleId===charge.cycleId&&p.memberUid===charge.member&&!p.settlementMarker)){
    const date=p.createdAt||p.paidAt||0;
    if(p.isSedekah)events.push({id:p.id,kind:'forgiven',date,text:t('Hutang dihalalkan'),amount:cents(p.amount)});
    else if(p.status==='rescheduled')events.push({id:p.id,kind:'rescheduled',date,text:t('Baki disusun semula'),amount:0});
    else if(p.source==='kongsipay'&&p.submittedBy){events.push({id:p.id,kind:'submitted',date,text:t('Bayaran dihantar untuk semakan'),amount:cents(p.amount),paymentId:p.id,hasProof:p.hasProof,detail:p.reference||p.method});if(p.reviewedAt)events.push({id:p.id+'-review',kind:p.status==='rejected'?'rejected':'approved',date:p.reviewedAt,text:p.status==='rejected'?t('Bayaran ditolak'):t('Bayaran disahkan owner'),amount:cents(p.amount),detail:p.rejectionReason});}
    else events.push({id:p.id,kind:'approved',date,text:p.partialPayment?t('Bayaran separa direkodkan'):t('Bayaran direkodkan'),amount:cents(p.amount),paymentId:p.id,hasProof:p.hasProof,detail:p.reference||p.method});
    if(p.reversedAt)events.push({id:p.id+'-undo',kind:'reversed',date:p.reversedAt,text:t('Bayaran dibatalkan'),amount:cents(p.amount)});
  }
  return events.sort((a,b)=>a.date-b.date||a.id.localeCompare(b.id));
}
export function reminderGroups(state,uid,{subscription='all',month='all',members=[],date,overdueOnly=false}={}){
  const allowed=new Set(state.subscriptions.filter(s=>s.createdBy===uid&&(subscription==='all'||s.id===subscription)).map(s=>s.id));
  const groups=new Map();
  for(const c of state.charges){if(!allowed.has(c.subscription)||c.self||c.member===uid||(members.length&&!members.includes(c.member)))continue;const cycle=state.subscriptions.find(s=>s.id===c.subscription)?.cycles.find(b=>b.id===c.cycleId);if(month!=='all'&&cycle?.startDate?.slice(0,7)!==month)continue;if(overdueOnly&&c.due>=date)continue;if(date&&cycle?.startDate?.slice(0,7)>date.slice(0,7))continue;const x=settlement(c,state.payments);if(!x.available)continue;if(!groups.has(c.member))groups.set(c.member,{member:c.member,charges:[],total:0});const g=groups.get(c.member);g.charges.push({...c,reminderAmount:x.available});g.total+=x.available;}
  return [...groups.values()].sort((a,b)=>b.total-a.total);
}
export function reminderText(state,group,url){const name=id=>state.members.find(m=>m.id===id)?.name||'Ahli',rm=n=>'RM '+(n/100).toFixed(2);return lhtml`Hai ${name(group.member)}, reminder mesra daripada KongsiPay:\n\n`+group.charges.map(c=>lhtml`• ${state.subscriptions.find(s=>s.id===c.subscription)?.name||'Subscription'} · ${c.period}: ${rm(c.reminderAmount)} (tarikh akhir ${c.due})`).join('\n')+lhtml`\n\nJumlah belum direkodkan: ${rm(group.total)}\nBayaran yang sedang disemak tidak termasuk.\n\nSemak bil & hantar bukti: ${url}`;}
export function statementRows(state,charges){const name=id=>state.members.find(m=>m.id===id)?.name||'Ahli';return charges.map(c=>{const x=settlement(c,state.payments);const forgiven=state.payments.filter(p=>p.cycleId===c.cycleId&&p.memberUid===c.member&&p.isSedekah&&!['reversed','rejected','rescheduled'].includes(p.status)).reduce((n,p)=>n+cents(p.amount),0);return {member:name(c.member),payee:name(c.payee),subscription:state.subscriptions.find(s=>s.id===c.subscription)?.name||'Subscription',period:c.period,due:c.due,amount:c.amount,received:x.received,pending:x.pending,forgiven,balance:x.balance};});}

export function providerAmount(cycle){return Number.isSafeInteger(cycle.providerAmountCents)&&cycle.providerAmountCents>0?cycle.providerAmountCents:null;}
export function collectionTotal(state,cycleId){return state.charges.filter(c=>c.cycleId===cycleId&&!c.self).reduce((n,c)=>n+c.amount,0);}
