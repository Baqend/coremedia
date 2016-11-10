import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import * as applicationActions from '../actions/application'
import MenuListItem from './MenuListItem'

const menuItems = [
  //{ text: 'Articles', link: '/articles', icon: 'fa fa-file' },
  { text: 'Products', link: '/products', icon: 'fa fa-shopping-cart' },
  { text: 'Comparison', link: '/comparison', icon: 'fa fa-table' },
]

const menuRightItems = [
  { text: '', link: '/account', icon: 'fa fa-user' },
]

class Menu extends React.Component {

  static propTypes = {
    activeClass: PropTypes.string.isRequired,
    application: PropTypes.object.isRequired,
  };

  render () {
    const { application: { isConnected, isLoggedIn } } = this.props
    return (
    <nav id="menu" className="navbar navbar-inverse navbar-fixed-top" role="navigation">
      <div className="container">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <Link to="/" className="navbar-brand">Baqend <i className="fa fa-heart"></i> CoreMedia</Link>
        </div>
        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul className="nav navbar-nav">
            {menuItems.map((item, i) => <MenuListItem {...item} key={i} />)}
          </ul>
          <ul className="nav navbar-nav navbar-right">
            {isConnected && isLoggedIn &&
            <MenuListItem text="Logout" link="/logout" icon="fa fa-sign-out"/>
            }
            {menuRightItems.map((item, i) => <MenuListItem {...item} key={i} />)}
          </ul>
        </div>
      </div>
    </nav>
    )
  }
}

export default connect(
  ({ application }) => ({ application }),
  applicationActions
)(Menu)
