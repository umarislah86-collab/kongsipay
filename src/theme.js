const key='kongsipay-theme';
export function applyTheme(value){if(!['dark','light','system'].includes(value))value='system';document.documentElement.dataset.theme=value;try{localStorage.setItem(key,value);}catch{}document.querySelectorAll('[data-theme-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.themeChoice===value)));}
export function currentTheme(){try{return localStorage.getItem(key)||'system';}catch{return 'system';}}
applyTheme(currentTheme());
export function themePicker(){return `<div class="theme-picker" role="group" aria-label="Tema paparan">${[['system','Ikut peranti'],['dark','Gelap'],['light','Terang']].map(([k,l])=>`<button type="button" class="secondary" data-theme-choice="${k}" aria-pressed="${currentTheme()===k}">${l}</button>`).join('')}</div>`;}
export function bindTheme(){document.querySelectorAll('[data-theme-choice]').forEach(b=>b.onclick=()=>applyTheme(b.dataset.themeChoice));}
