import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { firebaseConfig } from './firebase-config.js';
export const useEmulators=import.meta.env.VITE_USE_EMULATORS==='true'&&['localhost','127.0.0.1'].includes(location.hostname);
export const app=initializeApp(useEmulators?{...firebaseConfig,projectId:'demo-kongsipay',apiKey:'demo-kongsipay-key',authDomain:'demo-kongsipay.firebaseapp.com'}:firebaseConfig);
export const auth=getAuth(app);
export const db=getFirestore(app);
if(useEmulators){connectAuthEmulator(auth,'http://127.0.0.1:9099',{disableWarnings:true});connectFirestoreEmulator(db,'127.0.0.1',8080);}
