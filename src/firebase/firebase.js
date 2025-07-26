import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
      apiKey: "AIzaSyBEPT7LioE3S_hfcVHoTsIZXFQ8iy23p9U",
      authDomain: "shafi-be8b0.firebaseapp.com",
      databaseURL: "https://shafi-be8b0-default-rtdb.firebaseio.com",
      projectId: "shafi-be8b0",
      storageBucket: "shafi-be8b0.firebasestorage.app",
      messagingSenderId: "484211252002",
      appId: "1:484211252002:web:ec6634e9ba61034cc7237b",
      measurementId: "G-W3HHSQL780"
};

const app = initializeApp(firebaseConfig);

// ✅ فقط صدّر اللي محتاجه
export const storage = getStorage(app);
export const database = getDatabase(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
