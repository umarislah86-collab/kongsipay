let installPrompt;
const buttons=()=>document.querySelectorAll('.install-app');
function showInstall(){buttons().forEach(b=>{b.hidden=false;b.onclick=async()=>{if(!installPrompt)return;await installPrompt.prompt();const choice=await installPrompt.userChoice;if(choice.outcome==='accepted'){installPrompt=null;buttons().forEach(b=>b.hidden=true);}};});}
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;showInstall();});
window.addEventListener('appinstalled',()=>{installPrompt=null;buttons().forEach(b=>b.hidden=true);});
if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`,{scope:import.meta.env.BASE_URL}).catch(()=>{});});}
