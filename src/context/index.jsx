import { createContext, useState } from "react";

export const GlobalStateContext = createContext();

export function GlobalState({ children }) {
    const [loading, setLoading] = useState(false); 

    return (
        <GlobalStateContext.Provider value={{loading, setLoading}}>
            {children}
        </GlobalStateContext.Provider>
    )

}
 
