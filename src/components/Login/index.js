import React from 'react'
import { Row, Col, Button, Typography } from 'antd';
import { auth, provider } from '../../firebase/config.js';
import { signInWithPopup, getAdditionalUserInfo } from 'firebase/auth';
import { addDocument, generateKeywords } from '../../firebase/services.js';


export default function index() {
  const handleFbLogin = async () =>{
    await signInWithPopup(auth, provider).then((result) => {
      const user = result.user;
      const additionalUserInfo = getAdditionalUserInfo(result);
      if(additionalUserInfo?.isNewUser){
        addDocument("users",{
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
          providerId: additionalUserInfo.providerId,
          keywords: generateKeywords(user.displayName),
        })
      }
    });
    
  } 
  return (
    <div>
      <Row justify='center' style={{ height: 800}}>
        <Col span={8}>
            <Typography style={{ textAlign: 'center', fontSize: 30, fontWeight: 500}} level={3}>Fun Chat</Typography>
            <Button style={{ width: '100%', marginBottom: 5}}>
                Đăng nhập bằng Google
            </Button>
            <Button style={{ width: '100%'}} onClick={handleFbLogin}>
                Đăng nhập bằng Facebook
            </Button>
        </Col>
      </Row>
    </div>
  )
}
