import * as constants from '../constants'
import createReducer from '../utils/create-reducer'

const initialState = {
  user: null,
  error: null,
  isConnected: false,
  isLoggedIn: false,
  articles: [],
}

const actionHandlers = {
  [constants.LOGGED_IN]: (oldState, action) => ({ user: action.user, isLoggedIn: true }),
  [constants.LOG_OUT]: () => ({ user: null, isLoggedIn: false }),
  [constants.BAQEND_CONNECTED]: (_, action) => ({ isConnected: true, user: action.user, isLoggedIn: !!action.user }),
  [constants.ARTICLES_LOADED]: (_, action) => ({ articles: action.articles }),

  [constants.SHOW_ERROR]: (state, action) => {
    const { payload, source } = action
    return Object.assign({}, state, {
      error: {
        source,
        message: payload.message,
        statusCode: payload.statusCode || payload.code,
        body: payload.body || (payload instanceof Error ?
          (payload.toString() + '\n' + payload.stack) : payload)
      }
    })
  },
  [constants.HIDE_ERROR]: state => ({ ...state, ...{ error: null } }),
}

export default createReducer(initialState, actionHandlers)
