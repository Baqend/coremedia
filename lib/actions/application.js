import { db } from 'baqend'
import * as constants from '../constants'


import handleActionError from '../utils/handle-action-error'

export function baqendConnect () {
  return dispatch => {
    dispatch({
      type: constants.BAQEND_CONNECTING,
    })

    db.connect('coremedia')
      .then(() => dispatch({
        type: constants.BAQEND_CONNECTED,
        user: db.User.me,
      }))
      .catch(error => handleActionError(dispatch, error, constants.BAQEND_CONNECT))
  }
}


export function login (form, redirect) {
  const { username, password } = form
  return dispatch => {
    // simulate request
    db.User.login(username, password)
      .then((user) => {
        dispatch({
          type: constants.LOGGED_IN,
          user,
        })
        // Can be used to navigate to a new route
        if (redirect) redirect()
      })
      .catch(error => handleActionError(dispatch, error.message, constants.LOGGED_IN))
  }
}

export function logout () {
  return dispatch => {
    db.User.logout()
      .then(() => dispatch({ type: constants.LOG_OUT }))
      .catch(error => handleActionError(dispatch, error.message, constants.LOG_OUT))
  }
}

export function hideError () {
  return { type: constants.HIDE_ERROR }
}

export function loadArticles (published = true) {
  return dispatch => db => {
    db.Article.find()
      .equal('published', published)
      .resultList()
      .then(articles => ({ type: constants.ARTICLES_LOADED, articles }))
      .then(_ => dispatch(_))
  }
}