const {test}=require('node:test');
const assert=require('node:assert/strict');
const L=require('../dist/ledger.js');
const fixture=()=>({charges:[{id:'c',amount:1200,member:'amir',payee:'ali',self:false}],payments:[]});
test('equal splits preserve every cent',()=>{assert.deepEqual(L.split(1000,['a','b','c']).map(x=>x.amount),[334,333,333]);});
test('pending payment reserves amount without reducing balance',()=>{const s=fixture();L.record(s,{charge:'c',amount:500,method:'DuitNow'});assert.equal(L.balance(s,s.charges[0]),1200);assert.equal(L.available(s,s.charges[0]),700);});
test('partial approval reduces debt and duplicate approval fails',()=>{const s=fixture();const p=L.record(s,{charge:'c',amount:500,method:'Cash'});L.approve(s,p.id);assert.equal(L.balance(s,s.charges[0]),700);assert.throws(()=>L.approve(s,p.id));assert.equal(L.paid(s,'c'),500);});
test('overpayments and invalid values cannot create transactions',()=>{const s=fixture();for(const n of [0,-1,1201,NaN,1.2])assert.throws(()=>L.record(s,{charge:'c',amount:n,method:'DuitNow'}));assert.equal(s.payments.length,0);for(const value of ['1.999','-1','abc','Infinity','0'])assert.throws(()=>L.moneyInput(value));assert.equal(L.moneyInput('0.29'),29);});
test('new cycle preserves old debt and prevents duplicate charges',()=>{const s=fixture(),sub={id:'sub',price:1001,payer:'ali',members:['ali','amir']};L.cycle(s,sub,'2026-11','2026-11-25');assert.equal(s.charges.length,3);assert.equal(L.balance(s,s.charges[0]),1200);assert.equal(s.charges[1].self,true);assert.throws(()=>L.cycle(s,sub,'2026-11','2026-11-26'));assert.equal(s.charges.length,3);});
