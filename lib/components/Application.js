import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import Menu from './Menu'
import Footer from './Footer'
import DisplayError from './DisplayError'
import * as applicationActions from '../actions/application'

class Application extends Component {

  static propTypes = {
    children: PropTypes.any,
    application: PropTypes.object.isRequired,
  };

  constructor (props, context) {
    super(props, context)

    this.handleMenuClick = this.handleMenuClick.bind(this)

    this.state = {
      isMenuActive: false
    }
  }

  handleMenuClick (evt) {
    evt.preventDefault()
    // this.setState({ isMenuActive: !this.state.isMenuActive })
  }

  render () {
    const { isMenuActive } = this.state
    const activeClass = isMenuActive ? 'active' : ''

    return (
      <div id="layout" className={activeClass}>
        <a href="#menu" id="menuLink"
          className={classnames('menu-link', activeClass)}
          onClick={this.handleMenuClick}>
          <span></span>
        </a>

        <Menu activeClass={activeClass} />

        <div id="main">
          <DisplayError />
          {/* this will render the child routes */}
          {this.props.children}
        </div>

        <Footer />
      </div>
    )
  }
}

export default connect(
  ({ application }) => ({ application }),
  applicationActions
)(Application)
