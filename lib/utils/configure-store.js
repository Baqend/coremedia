/* global __DEVTOOLS__ */
import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import { reduxReactRouter, routerStateReducer } from 'redux-router'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import createHashHistory from 'history/lib/createHashHistory'
import baqend from '../middleware/baqend'
import logger from '../middleware/logger'
import * as reducers from '../reducers'

// Use hash location for Github Pages
// but switch to HTML5 history locally.
// const createHistory = process.env.NODE_ENV === 'production' ?
//   createHashHistory : createBrowserHistory

const createHistory = createHashHistory

function useNoQueryKey(createHistory) {
  return function(options={}) {
    options.queryKey = false;
    return createHistory(options);
  };
}

const storeEnhancers = [
  reduxReactRouter({ createHistory: useNoQueryKey(createHistory) })
]

if (__DEVTOOLS__) {
  const DevTools = require('../components/DevTools').default
  storeEnhancers.push(DevTools.instrument())
}

const finalCreateStore = compose(
  applyMiddleware(
    baqend,
    //logger
  ),
  ...storeEnhancers
)(createStore)

const combinedReducer = combineReducers(Object.assign({
  router: routerStateReducer
}, reducers))

export default function configureStore (initialState) {

  const store = finalCreateStore(combinedReducer, initialState)

  if (module.hot)
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default
      store.replaceReducer(nextRootReducer)
    })

  return store
}
