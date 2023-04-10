import React, { useContext, useMemo, useState } from 'react'
import { AuthContext } from './AuthProvider.js';
import UseFirestore from '../hooks/UseFirestore.js';

export const AppContext = React.createContext()
export default function AppProvider({children}) {
    const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
    const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const {user : {uid}} = useContext(AuthContext);


    const roomsCondition = useMemo(() => {
        return {
            fieldName: 'members',
            operator: 'array-contains',
            compareValue: uid,
        }
    },[uid]);
    const rooms = UseFirestore('rooms', roomsCondition);

    const selectedRoom = useMemo(() => rooms.find(room => room.id === selectedRoomId) || {},[rooms, selectedRoomId]);
    const usersCondition = useMemo(() => {
        return {
            fieldName: 'uid',
            operator: 'in',
            compareValue: selectedRoom.members,
        }
    },[selectedRoom.members]);
    const members = UseFirestore('users', usersCondition);
    return (
        <AppContext.Provider value={{ rooms, 
                                        isAddRoomVisible, 
                                        setIsAddRoomVisible, 
                                        isInviteMemberVisible, 
                                        setIsInviteMemberVisible,
                                        selectedRoomId, 
                                        setSelectedRoomId, 
                                        selectedRoom, 
                                        members }}>
            {children}
        </AppContext.Provider>
    )
}
    