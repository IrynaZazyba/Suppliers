import React, {createContext, useState} from 'react'

export const UserContext = createContext();
export default ({children}) => {
    const [userValue, setUserValue] = useState(null);

    return (
        <UserContext.Provider value={{
            data: userValue
        }}>{children}</UserContext.Provider>
    )
}