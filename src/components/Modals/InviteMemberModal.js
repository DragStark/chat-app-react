import React from 'react'
import { Modal, Form, Select, Spin, Avatar} from 'antd'
import { AppContext } from '../../context/AppProvider';
import { debounce }  from 'lodash';
import { collection,query, where, orderBy, limit, getDocs, updateDoc, doc} from 'firebase/firestore';
import { db } from '../../firebase/config.js';


function DebounceSelect({ fetchOptions, debounceTimeout = 300, ...props}) {
    const [ fetching, setFetching ] = React.useState(false);
    const [ options, setOptions ] = React.useState([]);
    const debounceFetcher = React.useMemo((value) => {
        const loadOptions = (value) => {
            setOptions([]);
            setFetching(true);
            fetchOptions(value, props.curMembers).then(newOptions => {
                setOptions(newOptions);
                setFetching(false);
            })
        }
        return debounce(loadOptions, debounceTimeout)
    },[fetchOptions, debounceTimeout]);
    return (<Select 
            labelInValue 
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={ fetching ? <Spin size='small'/>: null}
            {...props}
            >
            {
                options.map(option => (
                    <Select.Option key={option.value} value={option.value} title={option.label}>
                        <Avatar size='small' src={option.photoURL}>
                            {option.photoURL ? '' : option.label?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        {`${option.label}`}
                    </Select.Option>
                ))
            }
            </Select>)
}

async function fetchUserList(search, curMembers){
    let ref = query(collection(db,'users'), where('keywords','array-contains', search));
        ref = query(ref, orderBy('displayName'), limit(20));
    return getDocs(ref).then( snapshot => {
                return snapshot.docs.map(doc => ({
                    label: doc.data().displayName,
                    value: doc.data().uid,
                    photoURL: doc.data().photoURL,
                })).filter((opt) => !curMembers.includes(opt.value));
            });
}

export default function InviteMemberModal() {
    const {isInviteMemberVisible, setIsInviteMemberVisible, selectedRoomId, selectedRoom} = React.useContext(AppContext);
    const [value, setValue] = React.useState([])

    const [form] = Form.useForm();
    
    const handleOk = () =>{
        const roomRef = doc(db,'rooms',selectedRoomId);
        const data = {
            members: [...selectedRoom.members,...value.map(val => val.value)]
        };
        updateDoc(roomRef, data)
        form.resetFields();
        setIsInviteMemberVisible(false);
    }
    const handleCancel = () =>{
        form.resetFields();
        setIsInviteMemberVisible(false);
    }
  return (
    <div>
    <Modal title="Mời thêm thành viên" open={isInviteMemberVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} layout='vertical'>
            <DebounceSelect
                mode="multiple"
                label="Tên các thành viên"
                value={value}
                placeholder="Nhập tên thành viên"
                fetchOptions={fetchUserList}
                onChange={ newValue => setValue(newValue)}
                curMembers = {selectedRoom.members}
                style={{ width : '100%'}}
            >

            </DebounceSelect>
        </Form>
    </Modal>
    </div>
  )
}
