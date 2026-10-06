import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyASjSyOFUozYycIjGyyukOOQ5tFA469jNQ",
  authDomain: "versofeweb.firebaseapp.com",
  projectId: "versofeweb",
  storageBucket: "versofeweb.firebasestorage.app",
  messagingSenderId: "1063225396202",
  appId: "1:1063225396202:web:954d117f4e9ea930264093",
  measurementId: "G-VR6H5EFC3X"
};

// Inicializa o Firebase App
const app = initializeApp(firebaseConfig);

// Inicializa o Analytics de forma segura (Apenas no ambiente do Cliente/Navegador)
let analytics: ReturnType<typeof getAnalytics> | null = null;

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, analytics };

