import {split} from './model.mjs';
export function expenseShares(amount,members){if(!Number.isSafeInteger(amount)||amount<1||!members.length||new Set(members).size!==members.length)throw Error('Pilih ahli dan jumlah yang sah.');return Object.fromEntries(split(amount,members).map(x=>[x.member,x.amount]));}
export function expenseBalance(item){return Object.entries(item.shares).filter(([uid])=>uid!==item.payer&&!item.settled.includes(uid)).reduce((n,[,amount])=>n+amount,0);}
export function fundBalance(items,id){return items.filter(x=>x.kind==='entry'&&x.fundId===id).reduce((n,x)=>n+(x.entryType==='contribution'?x.amount:-x.amount),0);}
export function utilityAttention(items){return {expense:items.filter(x=>x.kind==='expense'&&x.status==='active'&&expenseBalance(x)>0).length,fund:items.filter(x=>x.kind==='fund'&&x.status==='active').length,shopping:items.filter(x=>x.kind==='shopping'&&x.status==='active').length};}
