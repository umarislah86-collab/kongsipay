import messages from './translations.json' with {type:'json'};
export const LANGUAGES=[['ms','Bahasa Melayu'],['en','English'],['ja','日本語'],['jv','Basa Jawa']];
export function currentLanguage(){try{const value=localStorage.getItem('kongsipay-language');return LANGUAGES.some(([k])=>k===value)?value:'ms';}catch{return 'ms';}}
export function locale(){return {ms:'ms-MY',en:'en-GB',ja:'ja-JP',jv:'id-ID'}[currentLanguage()];}
const keys=Object.keys(messages).sort((a,b)=>b.length-a.length);
const escaped=keys.map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
const pattern=new RegExp('(?<![\\p{L}\\p{N}_])('+escaped.join('|')+')(?![\\p{L}\\p{N}_])','gu');
export function translatePlain(text,language=currentLanguage()){if(language==='ms')return text;return String(text).replace(pattern,key=>messages[key]?.[language]||key);}
export function t(text){const lang=currentLanguage();return lang==='ms'?text:messages[text]?.[lang]||translateStatic(String(text));}
export function translateStatic(text){return text.split(/(<[^>]*>)/g).map(part=>part.startsWith('<')?part.replace(/(aria-label|title|placeholder)="([^"]*)"/g,(_,attr,value)=>`${attr}="${translatePlain(value)}"`):translatePlain(part)).join('');}
// Translate only source-authored template segments. Interpolated names, amounts,
// subscription titles and user notes pass through untouched.
export function lhtml(strings,...values){return strings.map((part,i)=>translateStatic(part.replace(/<option>([^<]+)<\/option>/g,(_,label)=>`<option value="${label}">${label}</option>`))+(i<values.length?values[i]:'' )).join('');}
export function languagePicker(){return `<label for="profile-language">${t('Bahasa')}</label><select id="profile-language">${LANGUAGES.map(([key,label])=>`<option value="${key}"${currentLanguage()===key?' selected':''}>${label}</option>`).join('')}</select><p class="help">${t('Pilih bahasa paparan.')}</p>`;}
export function bindLanguage(){const select=document.querySelector('#profile-language');if(select)select.onchange=()=>{try{localStorage.setItem('kongsipay-language',select.value);sessionStorage.setItem('kongsipay-language-return','profile');}catch{}location.reload();};}
export function localizeShell(){document.documentElement.lang=currentLanguage();const root=document.body;const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;while((node=walker.nextNode())){if(node.parentElement.closest('script,style,#content,#fields'))continue;node.nodeValue=translatePlain(node.nodeValue);}root.querySelectorAll('[aria-label],[title],[placeholder]').forEach(el=>{for(const attr of ['aria-label','title','placeholder'])if(el.hasAttribute(attr))el.setAttribute(attr,translatePlain(el.getAttribute(attr)));});}
