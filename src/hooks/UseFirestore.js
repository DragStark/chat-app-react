import { useEffect, useState} from 'react'
import { collection,query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config.js';

export default function UseFirestore( dataCollection, condition){
    const [documents, setDocuments] = useState([]);
    useEffect(() => {
        let collectionRef = query(collection(db, dataCollection), orderBy("createdAt")); 

        if(condition){
            if(!condition.compareValue || !condition.compareValue.length) return;
            collectionRef = query(collectionRef,where(condition.fieldName,condition.operator,condition.compareValue));
        }
        const unsubscribe = onSnapshot(collectionRef, (snapshot)=>{
            const documents = snapshot.docs.map((doc)=>({
              ...doc.data(),
              id: doc.id,
            }))
            setDocuments(documents);
          }
        )
        return unsubscribe;
      }, [dataCollection, condition]);
      return documents;
}
