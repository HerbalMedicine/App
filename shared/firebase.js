// Importar lo necesario
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCxKe0IfySvYREEBXromVSX21HvtOlDxYs",
  authDomain: "tiqunitours-2024-ps.firebaseapp.com",
  projectId: "tiqunitours-2024-ps",
  storageBucket: "tiqunitours-2024-ps.appspot.com",
  messagingSenderId: "478312258531",
  appId: "1:478312258531:web:3d856461aff532623a9ed6"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios
export const db = getFirestore(app);
export const storage = getStorage(app);

