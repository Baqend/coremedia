import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import * as applicationActions from '../../actions/application'
import fixRichtext from '../../utils/coremedia-utils'

class ProductOverview extends Component {

  static propTypes = {
    products: PropTypes.array.isRequired,
    loadProducts: PropTypes.func.isRequired,
    performSearch: PropTypes.func.isRequired,
    comparison: PropTypes.array.isRequired,
    toggleComparison: PropTypes.func.isRequired,
  };


  componentWillMount () {
    this.props.loadProducts()
    console.log("CWM" )
  }

  handleChange (event) {
    const term = event.target.value
    if (term.length){
      this.props.performSearch(term)
    } else {
      this.props.loadProducts()
    }
  }

  render () {
    const { products, comparison } = this.props
    const productList = products.map(_ => <div className="product col-md-12" key={_.id}>
      <div className="row">
        <div className="preview col-md-3">
          <img src="http://www.cicis.com/media/1138/pizza_trad_pepperoni.png"/><br/>
          <div className="checkbox">
            <label>
              <input type="checkbox"
                     checked={this.props.comparison.indexOf(_) != -1}
                     onChange={this.props.toggleComparison.bind(this, _)}/> Compare
            </label>
          </div>
        </div>
        <div className="info col-md-6">
          <h2><Link to={`/product/${_.key}`}>{_.title}</Link></h2>
          <div dangerouslySetInnerHTML={{__html:fixRichtext(_.shortDesc)}}></div>
        </div>
        <div className="col-md-3 rating">
          <div className="stars">
              <span><i className="fa fa-star"></i></span>
              <span><i className="fa fa-star"></i></span>
              <span><i className="fa fa-star"></i></span>
              <span><i className="fa fa-star-half-o"></i></span>
              <span><i className="fa fa-star-o"></i></span>
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
          <input type="text" name="term" className="form-control"
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
  ({ application: { products, comparison } }) => ({ products, comparison }),
  applicationActions
)(ProductOverview)
