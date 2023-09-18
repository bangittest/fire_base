// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"


const firebaseConfig = {
    apiKey: "AIzaSyA3AZrBFFmklFiB_bO6hfZbCW8rPB0J5bw",
    authDomain: "project-module02-f0164.firebaseapp.com",
    projectId: "project-module02-f0164",
    storageBucket: "project-module02-f0164.appspot.com",
    messagingSenderId: "133351681949",
    appId: "1:133351681949:web:d194797a5ac7523b5ec974"
};

// khởi tạo firebase
const app = initializeApp(firebaseConfig);
//tạo tham chiếu trong toàn bộ ứng dụng
const storage = getStorage(app)

//export ra bên ngoài để sử dụng
export { storage }