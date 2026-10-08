import {GoogleAuthProvider,signInWithCredential} from 'firebase/auth';
// Local synthetic identities only. Vite removes this import from production.
export function installEmulatorLogin(auth){
 const button=document.createElement('button');button.textContent='Login owner ujian tempatan';button.className='secondary';button.id='emulator-login';document.querySelector('#auth-screen').append(button);
 button.onclick=async()=>{const encode=x=>btoa(JSON.stringify(x)).replace(/=+$/,'').replace(/\+/g,'-').replace(/\//g,'_');const token=encode({alg:'none',typ:'JWT'})+'.'+encode({sub:'owner@example.test',email:'owner@example.test',email_verified:true,name:'Ali',iat:Math.floor(Date.now()/1000),exp:Math.floor(Date.now()/1000)+3600})+'.';try{await signInWithCredential(auth,GoogleAuthProvider.credential(token));}catch(e){button.textContent=e.message;}};
}
