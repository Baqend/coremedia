import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as applicationActions from '../../actions/application'

class Articles extends Component {

  static propTypes = {
    articles: PropTypes.array.isRequired,
    loadArticles: PropTypes.func.isRequired,
  };

  componentWillMount () {
    this.props.loadArticles()
  }

  render () {
    const { articles } = this.props
    const articleComps = articles.map(_ => <div key={_.id}><h2>{_.title}</h2><p>{_.text}</p></div>)

    return (
      <div>
        <div className="header">
          <h1>Articles</h1>
        </div>
        <div className="content">
          {articleComps}
        </div>
      </div>
    )
  }

}

export default connect(
  ({ application: { articles } }) => ({ articles }),
  applicationActions
)(Articles)
