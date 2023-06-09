import React, { useContext, useState, useMemo, useRef, useEffect } from 'react'
import styled from 'styled-components'
import {Avatar, Button, Tooltip, Form, Input, Alert} from 'antd';
import {UserAddOutlined} from '@ant-design/icons'
import Message from './Message';
import {AppContext} from '../../context/AppProvider';
import { addDocument } from '../../firebase/services';
import { AuthContext } from '../../context/AuthProvider';
import UseFirestore from '../../hooks/UseFirestore';

const HeaderStyled = styled.div`
    display: flex;
    justify-content: space-between;
    height: 56px;
    padding: 0 16px;
    align-items: center;
    border-bottom: 1px solid rgb(230, 230, 230);
    .header{
        &-info{
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        &-title{
            margin: 0;
            font-weight: bold;
        }
        &-description{
            font-size: 12px;
        }
    }
`

const ButtonGroupStyled = styled.div`
    display: flex;
    align-items: center;
`

const WrapperStyled = styled.div`
    height: 100vh;
    overflow-y: hidden;
`

const ContentStyled = styled.div`
    height: calc(100% - 70px);
    display: flex;
    flex-direction: column;
    padding: 11px;
    justify-content: flex-end;
`

const FormStyled = styled(Form)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 2px 2px 0;
    border: 1px solid rgb(230, 230, 230);
    border-radius: 2px;
    .ant-form-item{
        flex: 1;
    }
`

const MessageListStyled = styled.div`
    max-height: calc(100% - 80)%;
    over-flow-y: auto ;
    overflow-y: scroll;
    ::-webkit-scrollbar {
    width: 10px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
    background: #f1f1f1; 
    }
    
    /* Handle */
    ::-webkit-scrollbar-thumb {
    background: #888; 
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
    background: #555; 
    }
`

export default function ChatWindow() {
    const {selectedRoom, members, setIsInviteMemberVisible} = useContext(AppContext);
    
    const { user : {uid, photoURL,displayName}} = useContext(AuthContext);

    const [form] = Form.useForm();
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);
    const messageListRef = useRef(null);

    
    const condition = useMemo(() => ({
        fieldName : 'roomId',
        operator: '==',
        compareValue: selectedRoom.id,
    }),[selectedRoom.id]);
    const messages = UseFirestore('messages',condition);

    const handleInputChange = (e) =>{
        setInputValue(e.target.value)
    }
    const handleOnSubmit = (e) =>{
        addDocument('messages',{
            text: inputValue,
            uid,
            photoURL,
            roomId: selectedRoom.id,
            displayName,
        });
        form.resetFields(['message']);
        // focus to input again after submit
        if (inputRef?.current) {
            setTimeout(() => {
            inputRef.current.focus();
            });
        }
    }

    useEffect(() => {
    // scroll to bottom after message changed
    if (messageListRef?.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight + 50;
    }
  }, [messages]);
  return (
    <WrapperStyled>
        {
            selectedRoom.id ? (<>
                <HeaderStyled>
            <div className='header-info'>
                <p className='header-title'>{selectedRoom.name}</p>
                <span className='header-description'>
                    {selectedRoom.description}
                </span>
            </div>
            <ButtonGroupStyled>
                <Button type='text' icon={<UserAddOutlined/>} onClick={() => setIsInviteMemberVisible(true)}>Mời</Button>
                <Avatar.Group size="small" maxCount={2}>
                    {
                        members.map(member => (
                            <Tooltip title={member.displayName} key={member.uid}>
                                <Avatar src={member.photoURL}>{member.photoURL ? '': member.displayName?.charAt(0)?.toUpperCase()}</Avatar>
                            </Tooltip>
                        ))
                    } 
                </Avatar.Group>
            </ButtonGroupStyled>
        </HeaderStyled>
        <ContentStyled>
            <MessageListStyled ref={messageListRef}>
                {messages.map((mes) => (
                    <Message
                    key={mes.id}
                    text={mes.text}
                    photoURL={mes.photoURL}
                    displayName={mes.displayName}
                    createdAt={mes.createdAt}
                    />
                ))}
            </MessageListStyled>
            <FormStyled form={form}>
                <Form.Item name="message"> 
                    <Input 
                        ref={inputRef}
                        onChange={handleInputChange}
                        onPressEnter={handleOnSubmit}
                        placeholder='Nhập tin nhắn' 
                        bordered={false} 
                        autoComplete='off' 
                        className='ant-form-item'
                        >
                    </Input>
                </Form.Item>
                <Button type='primary' onClick={handleOnSubmit}>Gửi</Button>
            </FormStyled>
        </ContentStyled>
            </>) : <Alert message="Hãy chọn phòng" type='info' showIcon style={{margin: 5}} closable></Alert>
        }
    </WrapperStyled>
  )
}
