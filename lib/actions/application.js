import { db } from 'baqend/realtime'
import * as constants from '../constants'


import handleActionError from '../utils/handle-action-error'

export function baqendConnect () {
  return dispatch => {
    dispatch({
      type: constants.BAQEND_CONNECTING,
    })

    db.connect(CONNECT? CONNECT + '/v1': '')
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

export function loadProducts () {
  return dispatch => db => {
    db.Product.find()
      .equal('locale', 'en-US')
      .ascending('title')
      .resultList()
      .then(products => ({ type: constants.PRODUCTS_LOADED, products }))
      .then(dispatch)
  }
}

export function performSearch (term) {
  return dispatch => db => {
    db.Product.find()
      .equal('locale', 'en-US')
      .matches('search', '^.*' + term + '.*')
      .ascending('title')
      .resultList()
      .then(products => ({ type: constants.PRODUCTS_LOADED, products }))
      .then(dispatch)
  }
}

export function loadProduct (id) {
  return dispatch => db => {
    db.Product.load(id, {depth: 1})
      .then(product => ({ type: constants.PRODUCT_LOADED, product }))
      .then(dispatch)
  }
}

export function toggleComparison (product) {
  return dispatch => {
    dispatch({type : constants.PRODUCT_COMPARISON_TOGGLED, product})
  }
}

export function streamRatings () {
  return dispatch => db => {
    //Trigger initial ratings
    db.Rating.find().resultList().then(result => {
      var ratings = result.reduce((input, rating) => {
        input[rating.key] = rating;
        return input;
      }, {});
      dispatch({
        type: constants.RATINGS_UPDATED,
        ratings,
        stream })
    });

    //Trigger other ratings
    var stream = db.Rating.find().eventStream({initial: false});
    var subscription = stream.subscribe({next : event => {
      dispatch({
        type: constants.RATINGS_UPDATED,
        ratings : {
          [event.key] : event.data
        },
        subscription })
    }})
  }
}
