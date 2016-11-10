import * as constants from '../constants'
import createReducer from '../utils/create-reducer'

const initialState = {
  user: null,
  error: null,
  isConnected: false,
  isLoggedIn: false,
  articles: [],
  products: [],
  product: {},
  comparison: [],
}

const actionHandlers = {
  [constants.LOGGED_IN]: (oldState, action) => ({ user: action.user, isLoggedIn: true }),
  [constants.LOG_OUT]: () => ({ user: null, isLoggedIn: false }),
  [constants.BAQEND_CONNECTED]: (_, action) => ({ isConnected: true, user: action.user, isLoggedIn: !!action.user }),
  [constants.ARTICLES_LOADED]: (_, action) => ({ articles: action.articles }),
  [constants.PRODUCTS_LOADED]: (_, action) => ({ products: action.products }),
  [constants.PRODUCT_LOADED]: (_, action) => ({ product: action.product }),


  [constants.PRODUCT_COMPARISON_TOGGLED]: (state, action) => {
    const index = state.comparison.indexOf(action.product)
    if(index == -1) {
      return Object.assign({}, state, {comparison: [...state.comparison, action.product]})
    } else {
      const newArray = [...state.comparison]
      newArray.splice(index, 1)
      return Object.assign({}, state, {comparison: newArray })
    }
  },

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
