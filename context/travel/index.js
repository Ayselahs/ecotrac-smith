import { useContext, createContext, useReducer } from 'react'
import initialState from './state'
import reducer from './reducer'

export const travelContext = createContext()

export const useTravelContext = () => {
    const context = useContext(travelContext)
    if (context === undefined) {
        throw new Error('useTravelContext must be used within a TravelProvider')
    }
    return context
}

export const TravelProvider = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    return <travelContext.Provider {...props} value={[state, dispatch]} />
}