import '../assets/stylesheets/index.css'

import React, { PropTypes } from 'react'
import { Redirect, Route } from 'react-router'
import { ReduxRouter } from 'redux-router'
import { connect } from 'react-redux'
import { db } from 'baqend/realtime'
import configureStore from './utils/configure-store'
import * as components from './components'
import { logout as logoutAction, baqendConnect } from './actions/application'

const {
  Account,
  AccountHome,
  Application,
  Home,
  Login,
  Articles,
  ProductOverview,
  ProductDetails,
  ProductComparison
} = components

const initialState = {
  application: {
    isConnected: false,
    isLoggedIn: false,
    articles: [],
    products: [],
    product: null,
    comparison: [],
    ratings: {},
    subscription: null,
  }
}

export const store = configureStore(initialState)
store.dispatch(baqendConnect())

function requireAuth (nextState, replaceState, callback) {
  db.ready().then(() => {
    const isLoggedIn = !!db.User.me
    if (!isLoggedIn)
      replaceState({
        nextPathname: nextState.location.pathname
      }, '/login')
    callback()
  })
}

function logout (nextState, replaceState) {
  store.dispatch(logoutAction())
  replaceState({}, '/login')
}

class Root extends React.Component {
  static propTypes = {
    application: PropTypes.object.isRequired
  };

  render () {
    return (
      <ReduxRouter>
        <Route component={Application}>
          <Route path="/" component={Home} />
          <Route path="/products" component={ProductOverview} />
          <Route path="/comparison" component={ProductComparison} />
          <Route path="/product/:id" component={ProductDetails} />
          <Route path="/articles" component={Articles} />
          <Redirect from="/account" to="/account/profile" />
          <Route path="account" component={Account} onEnter={requireAuth}>
            <Route path="profile" component={AccountHome} />
          </Route>
          <Route path="login" component={Login} />
          <Route path="logout" onEnter={logout} />
        </Route>
      </ReduxRouter>
    )
  }
}

export default connect(({ application }) => ({ application }))(Root)
