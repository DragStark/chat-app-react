import React from 'react'
import {Modal, Form, Input} from 'antd'
import { AppContext } from '../../context/AppProvider';
import TextArea from 'antd/es/input/TextArea';
import { addDocument } from '../../firebase/services';
import { AuthContext } from '../../context/AuthProvider';

export default function AddRoomModal() {
    const {isAddRoomVisible, setIsAddRoomVisible} = React.useContext(AppContext);
    const {user: {uid}} = React.useContext(AuthContext);
    const [form] = Form.useForm();
    
    const handleOk = () =>{
        addDocument('rooms',{...form.getFieldValue(), members: [uid]});
        form.resetFields();
        setIsAddRoomVisible(false);
    }
    const handleCancel = () =>{
        form.resetFields();
        setIsAddRoomVisible(false);
    }
  return (
    <div>
    <Modal title="Tạo phòng" open={isAddRoomVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} layout='vertical'>
            <Form.Item label="Tên phòng" name="name">
                <Input placeholder='Nhập tên phòng'></Input>
            </Form.Item>
            <Form.Item label="Mô tả" name="description">
                <TextArea placeholder='Nhập mô tả'></TextArea>
            </Form.Item>
        </Form>
    </Modal>
    </div>
  )
}
