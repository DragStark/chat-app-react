# After clone this app run this command to install node modules
```
npm install
```

# Run this command to install some libraries 
```
npm install --save antd @ant-design/icons date-fns lodash styled-components react-router-dom firebase
```

# for use fire base for your project, you must be replace the code below in firebase/config.js by your firebase project setting
```
const firebaseConfig = {
  apiKey: "AIzaSyCX_Fs3KXQBAH-0N2D8CYWY30QG9SSFmaY",
  authDomain: "chatapp-f8f6c.firebaseapp.com",
  projectId: "chatapp-f8f6c",
  storageBucket: "chatapp-f8f6c.appspot.com",
  messagingSenderId: "532182057655",
  appId: "1:532182057655:web:d48db843fd883935084332",
  measurementId: "G-QXLLCD8DTB"
};
```

# if you want to use firebase emulator for testing by virtual data, uncomment lines below in firebase/config.js 
```
connectAuthEmulator(auth,'http://localhost:9099');
connectFirestoreEmulator(db, "localhost", 8080);
```

# Final, run this app by the command
```
npm start
```

## link demo: https://chatapp-f8f6c.web.app/
