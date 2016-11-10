import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import * as applicationActions from '../actions/application'
import MenuListItem from './MenuListItem'

const menuItems = [
  { text: 'Account', link: '/account', icon: 'fa fa-user' },
  { text: 'Articles', link: '/articles', icon: 'fa fa-file' },
]

class Menu extends React.Component {

  static propTypes = {
    activeClass: PropTypes.string.isRequired,
    application: PropTypes.object.isRequired,
  };

  render () {
    const { application: { isConnected, isLoggedIn } } = this.props
    return (
      <div id="menu" ref="menu" className={this.props.activeClass}>
        <div className="pure-menu">
          <Link to="/" className="pure-menu-heading">Baqend</Link>

          <ul className="pure-menu-list">
            {menuItems.map((item, i) => <MenuListItem {...item} key={i} />)}
            {isConnected && isLoggedIn &&
            <MenuListItem text="Logout" link="/logout" icon="fa fa-sign-out"/>
            }
          </ul>

          {isConnected &&
          <div className="pure-menu-heading">verbunden</div>
          }
        </div>
      </div>
    )
  }
}

export default connect(
  ({ application }) => ({ application }),
  applicationActions
)(Menu)
