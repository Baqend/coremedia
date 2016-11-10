import React, { PropTypes } from 'react'
import * as actions from '../../actions/application'

export default class Login extends React.Component {

  static propTypes = {
    location: PropTypes.object
  };

  static contextTypes = {
    store: PropTypes.any,
    history: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props)
    this.state = { username: null, password: null }
  }

  handleInputChange (evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    })
  }

  handleSubmit (evt) {
    evt.preventDefault()
    const { history, store } = this.context
    const { location } = this.props

    let nextPath = '/account'
    if (location.state && location.state.nextPathname)
      nextPath = location.state.nextPathname

    store.dispatch(actions.login(this.state, () => {
      // redirect to a secure page
      history.pushState({}, nextPath)
    }))
  }

  render () {
    return (
      <div>
        <div className="header">
          <h1>Login</h1>
        </div>
        <div className="content">
          <form
            className="explore pure-form pure-form-aligned"
            onSubmit={::this.handleSubmit}
            onChange={::this.handleInputChange}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" className="form-control" name="username" defaultValue="" />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" name="password" defaultValue="" />
              </div>
              <button type="submit" className="btn btn-default">Login</button>
          </form>
        </div>
      </div>
    )
  }
}
