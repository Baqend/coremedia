import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'

export default class MenuListItem extends Component {

  static propTypes = {
    icon: PropTypes.string.isRequired,
    isExternal: PropTypes.bool,
    link: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  };

  static defaultProps = { isExternal: false };

  render () {
    return (
      <li>
        {this.renderLink()}
      </li>
    )
  }

  renderLink () {
    if (this.props.isExternal)
      return (
        <a href={this.props.link} target="_blank" >
          <i className={this.props.icon}></i> {this.props.text}
        </a>
      )
    else
      return (
        <Link to={this.props.link} activeClassName='active'>
          <i className={this.props.icon}></i> {this.props.text}
        </Link>
      )
  }
}
