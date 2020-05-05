import Firebase, { db } from '../config/Firebase.js'

// define types
export const CREATEEVENT = 'CREATEEVENT'
export const UPDATE_SPORT = 'UPDATE_SPORT'
export const UPDATE_TIME = 'UPDATE_TIME'
export const UPDATE_LOCATION = 'UPDATE_LOCATION'
export const UPDATE_DIVISION = 'UPDATE_DIVISION'
export const UPDATE_PARTICIPANTS = 'UPDATE_PARTICIPANTS'
export const UPDATE_DATE = 'UPDATE_DATE'

export const UPDATE_NAME = 'UPDATE_NAME'
export const UPDATE_EMAIL = 'UPDATE_EMAIL'
export const UPDATE_PASSWORD = 'UPDATE_PASSWORD'

export const UPDATE_EVENTSPARTICIPATED = 'UPDATE_EVENTSPARTICIPATED'
export const UPDATE_GAMESPARTICIPATED = 'UPDATE_GAMESPARTICIPATED'
export const UPDATE_EVENTWINS = 'UPDATE_EVENTWINS'
export const UPDATE_GAMEWINS = 'UPDATE_GAMEWINS'

export const LOGIN = 'LOGIN'
export const SIGNUP = 'SIGNUP'


// actions
export const updateSport = sport => {
    return{
        type: UPDATE_SPORT,
        payload: sport
    }
}

export const updateTime = time => {
    return{
        type: UPDATE_TIME,
        payload: time
    }
}

export const updateLocation = location => {
    return{
        type: UPDATE_LOCATION,
        payload: location
    }
}

export const updateDivision = division => {
    return{
        type: UPDATE_DIVISION,
        payload: division
    }
}

export const updateParticipants = participants => {
    return{
        type: UPDATE_PARTICIPANTS,
        payload: participants
    }
}

export const updateDate = date => {
    return{
        type: UPDATE_DATE,
        payload: date
    }
}

export const updateName = name => {
    return{
        type: UPDATE_NAME,
        payload: name
    }
}

export const updateEmail = email => {
    return {
        type: UPDATE_EMAIL,
        payload: email
    }
}


//not used right now
export const updatePassword = password => {
    return {
        type: UPDATE_PASSWORD,
        payload: password
    }
}
export const updateEventsParticipated = eventsParticipated => {
    return {
        type: UPDATE_EVENTSPARTICIPATED,
        payload: eventsParticipated
    }
}
export const updateGamesParticipated = gamesParticipated => {
    return {
        type: UPDATE_GAMESPARTICIPATED,
        payload: gamesParticipated
    }
}
export const updateEventWins = eventWins => {
    return {
        type: UPDATE_EVENTWINS,
        payload: eventWins
    }
}
export const updateGameWins = gameWins => {
    return {
        type: UPDATE_GAMEWINS,
        payload: gameWins
    }
}
//till here 


export const login = () => {
    return async (dispatch, getState) => {
        try {
            const { email, password } = getState().user
            const response = await Firebase.auth().signInWithEmailAndPassword(email, password)

            dispatch(getUser(response.user.uid))
        } catch (e) {
            alert(e)
        }
    }
}

export const getUser = uid => {
    return async (dispatch, getState) => {
        try {
            const user = await db
                .collection('users')
                .doc(uid)
                .get()

            dispatch({ type: LOGIN, payload: user.data() })
        } catch (e) {
            alert(e)
        }
    }
}

export const signup = () => {
    return async (dispatch, getState) => {
        try {
            const { email, password, name } = getState().user
            const response = await Firebase.auth().createUserWithEmailAndPassword(email, password)
            if (response.user.uid) {
                const user = {
                    uid: response.user.uid,
                    email: email,
                    name: name,
                    admin: false,
                    statistics:{
                        eventsParticipated: 0,
                        eventWins: 0,
                        gamesParticipated: 0,
                        gameWins: 0,
                    }
                    
                }

                db.collection('users')
                    .doc(response.user.uid)
                    .set(user)

                dispatch({ type: SIGNUP, payload: user })
            }
        } catch (e) {
            alert(e)
        }
    }
}

export const updateUser = (user)=>{
    return async (dispatch, getState) => {
        try {

            dispatch({ type: SIGNUP, payload: user })
        } catch (e) {
            alert(e)
        }
    }
}

export const createEvent = () => {
    return async (dispatch, getState) => {
        try {
            const {sport, time, location, division, participants, date} = getState().user
            console.log('new Date(date).getTime()',new Date(date).getTime());
            console.log('new Date(date).getTime()',new Date(date));
            const eventData = {
                sport: sport,
                time: time,
                location: location,
                division: division,
                participants: participants,
                date: date,
                dt:new Date(date).getTime(),
                status:'created'
            }
            console.log("eventData", eventData)
            db.collection('events')
                    .add(eventData)

                dispatch({ type: CREATEEVENT, payload: eventData })
        } catch (e) {
            alert(e)
        }
    }
}