import {t,lhtml,locale} from './i18n.js';
const paths={
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  pin:'<path d="m16 3 5 5-4 2-2 5-3-3-5 2-2-2 2-5-3-3 5-2Z"/><path d="m12 12-9 9"/>',
  layers:'<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/>',
  play:'<rect x="3" y="4" width="18" height="16" rx="5"/><path d="m10 8 6 4-6 4Z"/>',
  music:'<path d="M9 18V5l11-2v13M9 8l11-2"/><ellipse cx="6" cy="18" rx="3" ry="3"/><ellipse cx="17" cy="16" rx="3" ry="3"/>',
  screen:'<rect x="3" y="4" width="18" height="13" rx="3"/><path d="M8 21h8m-4-4v4"/>',
  game:'<path d="M7 7h10c3 0 5 11 3 12-2 1-4-3-5-3H9c-1 0-3 4-5 3C2 18 4 7 7 7Z"/><path d="M8 10v5m-2.5-2.5h5M16 11h.01M18 14h.01"/>',
  cloud:'<path d="M7 19a5 5 0 0 1-1-10 6 6 0 0 1 11-2 6 6 0 0 1 1 12H7Z"/>',
  wallet:'<path d="M20 8V5H6a3 3 0 0 0 0 6h15v9H6a3 3 0 0 1-3-3V8"/><path d="M21 12h-5v5h5m-2.5-2.5h.01"/>',
  card:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18M7 15h4"/>',
  repeat:'<path d="m17 2 4 4-4 4M3 11V8a2 2 0 0 1 2-2h16M7 22l-4-4 4-4m14-1v3a2 2 0 0 1-2 2H3"/>',
  home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z"/>',
  wifi:'<path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0m-11 4a6 6 0 0 1 8 0M12 20h.01"/>',
  phone:'<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 5h4m-2 14h.01"/>',
  bolt:'<path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z"/>',
  water:'<path d="M12 2S5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13Z"/><path d="M8 15a4 4 0 0 0 4 4"/>',
  coffee:'<path d="M4 8h12v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Zm12 1h2a3 3 0 0 1 0 6h-2M7 2v3m5-3v3M2 22h18"/>',
  food:'<path d="M4 2v7a3 3 0 0 0 6 0V2M7 2v20m12 0V2c-4 3-5 9 0 10"/>',
  car:'<path d="m5 6-2 7v6h3v-3h12v3h3v-6l-2-7H5ZM3 12h18M6 15h.01M18 15h.01"/>',
  plane:'<path d="m22 2-7 20-4-9-9-4 20-7Zm-11 11L22 2"/>',
  bag:'<rect x="4" y="7" width="16" height="14" rx="3"/><path d="M8 9V6a4 4 0 0 1 8 0v3"/>',
  book:'<path d="M12 5c-3-2-6-2-10-1v16c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1Zm0 0v16"/>',
  fitness:'<path d="m7 7 10 10M3 8l5-5m8 18 5-5M2 5l3-3m14 20 3-3M5 10l5-5m4 14 5-5"/>',
  heart:'<path d="M20 5c-3-3-6-1-8 1-2-2-5-4-8-1-5 5 2 11 8 16 6-5 13-11 8-16Z"/>',
  people:'<circle cx="9" cy="7" r="3"/><path d="M2 21v-3a7 7 0 0 1 14 0v3m0-17a3 3 0 0 1 0 6m3 4a6 6 0 0 1 3 5v2"/>',
  flower:'<path d="M12 8c-7-12-15 2-5 4-12 7 2 15 5 4 7 12 15-2 4-4 12-7-2-15-4-4Z"/><circle cx="12" cy="12" r="3"/>'
};
export const ICONS=Object.entries({layers:t("Umum"),play:'Video',music:t("Muzik"),screen:t("TV & skrin"),game:'Gaming',cloud:'Cloud',wallet:t("Dompet"),card:t("Kad & bil"),repeat:t("Giliran"),home:t("Rumah"),wifi:'Internet',phone:t("Telefon"),bolt:t("Elektrik"),water:t("Air"),coffee:t("Kopi"),food:t("Makanan"),car:t("Kereta"),plane:'Travel',bag:'Shopping',book:t("Belajar"),fitness:'Fitness',heart:t("Penjagaan"),people:'Group',flower:'Personal'}).map(([key,label])=>({key,label}));
export const TONES={sage:{label:'Sage',ink:'#c5e4b1',bg:'#293b2e'},gold:{label:'Gold',ink:'#f2d397',bg:'#413625'},sky:{label:'Sky',ink:'#a9d4f3',bg:'#26394b'},lilac:{label:'Lilac',ink:'#d7c2f0',bg:'#393047'},rose:{label:'Rose',ink:'#f0b9c4',bg:'#432e36'},stone:{label:'Stone',ink:'#d6d7cf',bg:'#343734'}};
export const validIcon=key=>Object.hasOwn(paths,key);
export const validTone=key=>Object.hasOwn(TONES,key);
export function resolveIcon(sub){if(validIcon(sub.iconKey))return sub.iconKey;const text=((sub.name||'')+' '+(sub.iconEmoji||'')).toLowerCase();for(const [pattern,key] of [[/youtube|netflix|disney|📺|🍿/,'play'],[/spotify|music|muzik|🎵/,'music'],[/game|magic|🎮/,'game'],[/cloud|drive|icloud|☁/,'cloud'],[/wifi|internet/,'wifi'],[/rumah|sewa/,'home'],[/💳/,'card'],[/💸/,'wallet']])if(pattern.test(text))return key;return sub.billingType==='hutang'?'wallet':sub.billingType==='rotation'?'repeat':'layers';}
export function glyph(key){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[validIcon(key)?key:'layers']}</svg>`;}
export function serviceIcon(sub){const key=resolveIcon(sub),tone=TONES[validTone(sub.iconColor)?sub.iconColor:'sage'];return `<span class="service-icon premium-icon" style="--icon-ink:${tone.ink};--icon-bg:${tone.bg}">${glyph(key)}</span>`;}
export function iconPicker(sub={}){const key=resolveIcon(sub),color=validTone(sub.iconColor)?sub.iconColor:'sage';return lhtml`<fieldset class="icon-picker"><legend>Ikon subscription</legend><input type="hidden" name="iconKey" value="${key}"><input type="hidden" name="iconColor" value="${color}"><div class="icon-preview">${serviceIcon({...sub,iconKey:key,iconColor:color})}<span><strong id="icon-choice-label">${ICONS.find(i=>i.key===key).label}</strong><small>Pilih ikon & warna anda</small></span></div><div class="icon-grid" role="group" aria-label="Pilihan ikon">${ICONS.map(i=>`<button type="button" class="icon-option" data-icon-key="${i.key}" aria-label="${i.label}" title="${i.label}" aria-pressed="${i.key===key}">${glyph(i.key)}<span>${i.label}</span></button>`).join('')}</div><div class="tone-grid" role="group" aria-label="Warna ikon">${Object.entries(TONES).map(([k,t])=>`<button type="button" data-icon-tone="${k}" class="tone-option" style="--tone:${t.ink}" aria-label="${t.label}" title="${t.label}" aria-pressed="${k===color}"><span></span></button>`).join('')}</div></fieldset>`;}
export function bindIconPicker(root){const key=root.querySelector('[name=iconKey]'),color=root.querySelector('[name=iconColor]');if(!key||!color)return;const update=()=>{root.querySelector('.icon-preview .service-icon').outerHTML=serviceIcon({iconKey:key.value,iconColor:color.value});root.querySelector('#icon-choice-label').textContent=ICONS.find(i=>i.key===key.value).label;root.querySelectorAll('[data-icon-key]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.iconKey===key.value)));root.querySelectorAll('[data-icon-tone]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.iconTone===color.value)));};root.querySelectorAll('[data-icon-key]').forEach(b=>b.onclick=()=>{key.value=b.dataset.iconKey;update();});root.querySelectorAll('[data-icon-tone]').forEach(b=>b.onclick=()=>{color.value=b.dataset.iconTone;update();});}
