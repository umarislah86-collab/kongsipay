import {settlement,summary} from './model.mjs';

export function ownerCollection(state,uid,{subscription='all',month='all'}={}){
  const owned=state.subscriptions.filter(s=>s.createdBy===uid);
  const ids=new Set(owned.filter(s=>subscription==='all'||s.id===subscription).map(s=>s.id));
  const charges=state.charges.filter(c=>ids.has(c.subscription)&&!c.self&&c.member!==uid&&(month==='all'||owned.find(s=>s.id===c.subscription)?.cycles.find(b=>b.id===c.cycleId)?.startDate?.slice(0,7)===month));
  const rows=[...new Set(charges.map(c=>c.member))].map(member=>{
    const list=charges.filter(c=>c.member===member),totals=summary(state,list);
    const status=!totals.outstanding?'paid':totals.pending?'pending':totals.cleared?'partial':'unpaid';
    return {member,charges:list,...totals,status};
  }).sort((a,b)=>b.outstanding-a.outstanding||a.member.localeCompare(b.member));
  return {owned,charges,rows,...summary(state,charges)};
}

export function ownerDashboard(ctx){
  const {esc,rm,heading,chargeTable}=ctx;
  let subscription='all',month='all',status='all';
  const labels={paid:'Dah bayar',pending:'Menunggu pengesahan',partial:'Separa',unpaid:'Belum bayar'};
  function render(){
    const state=ctx.state,uid=ctx.user.uid;
    const owned=state.subscriptions.filter(s=>s.createdBy===uid);
    if(!owned.some(s=>s.id===subscription))subscription='all';
    const months=[...new Set(owned.filter(s=>subscription==='all'||s.id===subscription).flatMap(s=>s.cycles.filter(c=>!c.superseded).map(c=>c.startDate.slice(0,7))))].sort().reverse();
    if(month!=='all'&&!months.includes(month))month='all';
    const data=ownerCollection(state,uid,{subscription,month});
    const rows=data.rows.filter(r=>status==='all'||r.status===status);
    const pending=state.payments.filter(p=>p.status==='pending'&&data.charges.some(c=>c.cycleId===p.cycleId&&c.member===p.memberUid));
    const counts=Object.fromEntries(Object.keys(labels).map(k=>[k,data.rows.filter(r=>r.status===k).length]));
    return heading('Dashboard kutipan','Siapa dah bayar, siapa belum — semua di sini.')+`<div class="owner-filters"><label for="owner-sub">Subscription<select id="owner-sub"><option value="all">Semua yang saya urus</option>${owned.map(s=>`<option value="${esc(s.id)}" ${subscription===s.id?'selected':''}>${esc(s.name)}</option>`).join('')}</select></label><label for="owner-month">Bulan bil<select id="owner-month"><option value="all">Semua bulan</option>${months.map(m=>`<option value="${m}" ${month===m?'selected':''}>${new Date(m+'-01T12:00:00Z').toLocaleDateString('ms-MY',{month:'long',year:'numeric',timeZone:'Asia/Kuala_Lumpur'})}</option>`).join('')}</select></label></div><div class="owner-totals"><div><small>Patut diterima</small><strong>${rm(data.total)}</strong></div><div class="received"><small>Dah diterima</small><strong>${rm(data.received)}</strong></div><div><small>Belum diterima</small><strong>${rm(data.outstanding)}</strong></div></div><p class="help owner-note">Kutipan daripada ahli sahaja; bahagian sendiri tidak termasuk.${month==='all'?' Semua bil termasuk bil akan datang.':''}${data.forgiven?` ${rm(data.forgiven)} telah dihalalkan.`:''}</p><div class="owner-status-filters">${[['all','Semua',data.rows.length],...Object.entries(labels).map(([k,l])=>[k,l,counts[k]])].map(([k,l,n])=>`<button class="filter ${status===k?'active':''}" data-owner-status="${k}">${l} <span>${n}</span></button>`).join('')}</div><div class="section-title"><h2>Status ahli</h2><small>Tekan nama untuk lihat bil</small></div><div class="owner-members">${rows.map(r=>{
      const m=state.members.find(m=>m.id===r.member);
      const overdue=r.charges.some(c=>c.due<ctx.today()&&settlement(c,state.payments).balance>0);
      return `<details class="owner-member"><summary><span class="avatar small">${esc((m?.name||'A')[0])}</span><span class="owner-member-name"><strong>${esc(m?.name||'Ahli')}</strong><small>${r.charges.length} bil${overdue?' · Ada bil tertunggak':''}</small></span><span class="owner-member-amount"><strong>${rm(r.outstanding)}</strong><small>Baki</small></span><span class="badge ${r.status==='unpaid'?'debt':r.status==='paid'?'':'wait'}">${r.forgiven===r.total&&r.status==='paid'?'Dihalalkan':labels[r.status]}</span></summary><div class="member-breakdown"><span>Diterima: ${rm(r.received)}</span>${r.pending?`<span>Dalam semakan: ${rm(r.pending)}</span>`:''}${r.forgiven?`<span>Dihalalkan: ${rm(r.forgiven)}</span>`:''}</div>${chargeTable(r.charges.slice().sort((a,b)=>a.due.localeCompare(b.due)))}</details>`;
    }).join('')||'<div class="panel empty">Tiada ahli dengan bil dalam pilihan ini.</div>'}</div>${pending.length?`<div class="panel owner-pending"><div class="panel-head"><h2>${pending.length} bayaran untuk disahkan</h2><span class="badge wait">${rm(data.pending)}</span></div>${pending.map(p=>`<div class="subrow"><div class="subinfo"><strong>${esc(state.members.find(m=>m.id===p.memberUid)?.name||'Ahli')} · ${rm(Math.round(p.amount*100))}</strong><small>${esc(owned.find(s=>s.id===p.subscriptionId)?.name)} · ${esc(p.method||'Bayaran')}<br>${esc(p.reference||'Tiada reference')}</small></div><div class="actions"><button class="table-btn" data-approve="${esc(p.id)}">Sahkan</button><button class="text-btn" data-reject="${esc(p.id)}">Tolak</button></div></div>`).join('')}</div>`:''}`;
  }
  function bind(){const sub=document.querySelector('#owner-sub'),m=document.querySelector('#owner-month');if(sub)sub.onchange=e=>{subscription=e.target.value;ctx.render();};if(m)m.onchange=e=>{month=e.target.value;ctx.render();};document.querySelectorAll('[data-owner-status]').forEach(b=>b.onclick=()=>{status=b.dataset.ownerStatus;ctx.render();});}
  return {render,bind,reset(){subscription='all';month='all';status='all';}};
}
