import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import * as applicationActions from '../../actions/application'
import fixRichtext from '../../utils/coremedia-utils'
import { db } from 'baqend/streaming'

class ProductOverview extends Component {

  static propTypes = {
    products: PropTypes.array.isRequired,
    loadProducts: PropTypes.func.isRequired,
    performSearch: PropTypes.func.isRequired,
    comparison: PropTypes.array.isRequired,
    toggleComparison: PropTypes.func.isRequired,
    streamRatings: PropTypes.func.isRequired,
    ratings: PropTypes.object.isRequired,
    stream: PropTypes.object,
  };


  componentWillMount () {
    this.props.streamRatings()
    this.props.loadProducts()
  }

  componentWillUnMount () {
    this.props.stream.unsubscribe()
  }

  handleChange (event) {
    const term = event.target.value
    if (term.length){
      this.props.performSearch(term)
    } else {
      this.props.loadProducts()
    }
  }

  getImage(product) {
    return product.mediaLinks && product.mediaLinks.length? 'https://coremedia.baqend.com/v1/code/img?id=' + product.mediaLinks[0] + '&width=400': '';
  }

  getStars(rating) {
    const result = [];
    const whole = Math.floor(rating);
    var empty = 5 - whole;
    for (var i = 0; i < whole; i++) {
      result.push(<span key={i}><i className="fa fa-star"></i></span>)
    }
    if (rating - whole > 0){
      result.push(<span key={whole}><i className="fa fa-star-half-o"></i></span>)
      empty--;
    }
    for (var i = 0; i < empty; i++) {
      result.push(<span key={5-i}><i className="fa fa-star-o"></i></span>)
    }
    return result;
  }

  render () {
    const { products, comparison, ratings } = this.props
    console.log("ratings", ratings)
    const productList = products.map(_ => <div className="product col-xs-12 col-sm-6 col-md-4" key={_.id}>
        <div className="product-inner">
            <div className="preview">
              <Link to={`/product/${_.key}`}>
                <img src={this.getImage(_)}/>
              </Link>
            </div>
            <div className="compare">
              <label>
                <input type="checkbox"
                       checked={this.props.comparison.indexOf(_) != -1}
                       onChange={this.props.toggleComparison.bind(this, _)}/> Compare
              </label>
            </div>
            <div className="info">
              <h2><Link to={`/product/${_.key}`}>{_.title}</Link></h2>
              <div dangerouslySetInnerHTML={{__html:fixRichtext(_.shortDesc)}}></div>
            </div>
            <div className="rating">
              <div className="stars">
                {this.getStars(ratings[_.key] ? ratings[_.key].stars : 0)}
              </div>
              <div>
                <span className="label label-info">13</span>
              </div>
            </div>
        </div>
    </div>)

    return (
      <div id="product-overview">
        <div className="search row">
          <div className="col-md-9 input-group">
            <input type="text" name="term" className="form-control search-field"
                   onChange={::this.handleChange} placeholder="Search for..."/>
          </div>
        </div>
        <div className="content row">
          {productList}
        </div>
      </div>
    )
  }
}

export default connect(
  ({ application: { products, comparison, stream, ratings } }) => ({ products, comparison, stream, ratings }),
  applicationActions
)(ProductOverview)
