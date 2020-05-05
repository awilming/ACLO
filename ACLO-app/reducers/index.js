import { combineReducers } from 'redux';
import { 
    CREATEEVENT,
    UPDATE_SPORT,
    UPDATE_TIME,
    UPDATE_LOCATION,
    UPDATE_DIVISION,
    UPDATE_PARTICIPANTS,
    UPDATE_DATE,
    LOGIN, 
    SIGNUP, 
    UPDATE_EMAIL, 
    UPDATE_PASSWORD, 
    UPDATE_NAME,
    UPDATE_EVENTSPARTICIPATED, 
    UPDATE_GAMESPARTICIPATED,
    UPDATE_EVENTWINS,
    UPDATE_GAMEWINS,
     } from '../actions/user';

const user = (state = {}, action) => {
    switch (action.type) {
        //create event
        //  case CREATEEVENT:
        //     return action.payload
        //event data
        case UPDATE_SPORT:
            return { ...state, sport: action.payload }
        case UPDATE_TIME:
            return { ...state, time: action.payload }
        case UPDATE_LOCATION:
            return { ...state, location: action.payload }
        case UPDATE_DIVISION:
            return { ...state, division: action.payload }
        case UPDATE_PARTICIPANTS:
            return { ...state, participants: action.payload }
        case UPDATE_DATE:
            return { ...state, date: action.payload }
        //authentication
        case LOGIN:
            return action.payload
        case SIGNUP:
            return action.payload
        case UPDATE_EMAIL:
            return { ...state, email: action.payload }
        case UPDATE_PASSWORD:
            return { ...state, password: action.payload }
        case UPDATE_NAME:
            return { ...state, name: action.payload }
        //statistics
        case UPDATE_EVENTSPARTICIPATED:
            return { ...state, eventsParticipated: action.payload }
        case UPDATE_GAMESPARTICIPATED:
            return { ...state, gamesParticipated: action.payload }
        case UPDATE_EVENTWINS:
            return { ...state, eventWins: action.payload }
        case UPDATE_GAMEWINS:
            return { ...state, gameWins: action.payload }
        default:
            return state
    }
}

const rootReducer = combineReducers({
    user
})

export default rootReducer
