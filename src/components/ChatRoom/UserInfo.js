import React, {useContext} from 'react'
import { Avatar, Button, Typography } from 'antd';
import styled from 'styled-components';
import { auth } from '../../firebase/config.js';
import {AuthContext} from '../../context/AuthProvider.js';

const WrapperStyled = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(82, 38, 3);
    .username{
        color: #fff;
        margin-left: 5px;
    } 
`;

export default function UserInfo() {
  const { user:{displayName, photoURL} } = useContext(AuthContext);
  return (
    <WrapperStyled>
      <div>
        <Avatar src={photoURL}>{photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}</Avatar>
        <Typography.Text className='username'>{displayName}</Typography.Text>
      </div>
      <Button ghost onClick={()=> auth.signOut()}>Đăng Xuất</Button>
    </WrapperStyled>
  )
}
