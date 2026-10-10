import {test} from 'node:test';
import assert from 'node:assert/strict';
import {calendarOccurrences,personalItems,searchRecords,spaceBackup,spaceCSV} from '../src/utility-extras.mjs';

test('recurrence keeps the original day across short months and leap years',()=>{
 const monthly={eventDate:'2026-01-31',repeat:'monthly'};
 assert.ok(calendarOccurrences(monthly,'2026-02','2026-02-01').includes('2026-02-28'));
 assert.ok(calendarOccurrences(monthly,'2026-03','2026-02-01').includes('2026-03-31'));
 assert.ok(!calendarOccurrences(monthly,'2025-12','2026-02-01').includes('2025-12-31'));
 const leap={eventDate:'2024-02-29',repeat:'yearly'};
 assert.ok(calendarOccurrences(leap,'2025-02','2025-01-01').includes('2025-02-28'));
 assert.ok(calendarOccurrences(leap,'2028-02','2028-01-01').includes('2028-02-29'));
 assert.ok(calendarOccurrences({eventDate:'2030-10-10',repeat:'yearly'},'2026-10','2026-10-10').includes('2030-10-10'));
 assert.deepEqual(calendarOccurrences({eventDate:'2026-10-10'},'2026-10','2026-10-10'),['2026-10-10']);
});

test('personal items distinguish each member and only include nearby shared events',()=>{
 const items=[{id:'a',kind:'task',title:'My task',status:'active',assignees:['me','other'],turn:0,dueDate:'2026-10-11'},
 {id:'b',kind:'task',title:'Their task',status:'active',assignees:['other'],turn:0,dueDate:'2026-10-11'},
 {id:'c',kind:'shopping',title:'My shopping',status:'active',assignee:'me'},
 {id:'d',kind:'shopping',title:'Done shopping',status:'done',assignee:'me'}];
 const events=[{id:'other-task',kind:'task',title:'Their task',date:'2026-10-11',status:'active'},{id:'e',kind:'calendarEvent',title:'Next week',date:'2026-10-17',status:'active'},{id:'f',kind:'calendarEvent',title:'Too far',date:'2026-10-18',status:'active'}];
 assert.deepEqual(personalItems({charges:[]},items,'me',events,'2026-10-10').map(x=>x.id).sort(),['a','c','e']);
});

test('search includes archived records, notes and subscription bill labels',()=>{
 const state={subscriptions:[{id:'s',name:'YouTube',cycles:[{id:'c',label:'October 2026'}]}]},spaces=[{id:'space',name:'Family'}],items=[{id:'i',spaceId:'space',kind:'board',title:'Travel',body:'Resort booking',status:'done'}];
 assert.equal(searchRecords(state,spaces,items,'resort')[0].spaceName,'Family');
 assert.equal(searchRecords(state,spaces,items,'october')[0].subscriptionId,'s');
 assert.deepEqual(searchRecords(state,spaces,items,''),[]);
});

test('backup is scoped to one space and CSV neutralizes spreadsheet formulas',()=>{
 const items=[{id:'1',spaceId:'a',kind:'fund',title:'=CMD()',target:5000,status:'active'},{id:'2',spaceId:'b',title:'Other'}];
 const backup=spaceBackup({id:'a'},items,[{spaceId:'b'},{spaceId:'a'}],{receipt:{name:'file'}});
 assert.equal(backup.items.length,1);assert.equal(backup.activity.length,1);assert.equal(backup.moneyUnit,'sen');assert.equal(backup.attachments.receipt.name,'file');
 const csv=spaceCSV([items[0]]);assert.match(csv,/'=CMD\(\)/);assert.match(csv,/50\.00/);
});
