import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import * as applicationActions from '../../actions/application'

class AccountHome extends Component {

  static propTypes = {
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
  };

  constructor () {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.props.logout()
  }

  render () {
    const { user } = this.props
    const logoutLink = (<Link to="/logout">logout</Link>)

    if (!user)
      return <div></div>

    return (
      <div>
        <div className="header">
          <h1>{user.username}</h1>
        </div>
        <div className="content">
          <p>
            Congratulations, you've entered an area secured by login!
            <br/>
            You can {logoutLink}.
            <button onClick={this.handleClick}>Logout here</button>
          </p>
        </div>
      </div>
    )
  }

}

export default connect(
  ({ application: { user } }) => ({ user }),
  applicationActions
)(AccountHome)
