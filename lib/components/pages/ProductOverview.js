import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import * as applicationActions from '../../actions/application'

class ProductOverview extends Component {

  static propTypes = {
    products: PropTypes.array.isRequired,
    loadProducts: PropTypes.func.isRequired,
    performSearch: PropTypes.func.isRequired,
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
    const { products } = this.props
    const productList = products.map(_ => <div className="product col-md-9" key={_.id}>
      <div className="row">
        <div className="preview col-md-4">
          <img src="http://www.cicis.com/media/1138/pizza_trad_pepperoni.png"/>
        </div>
        <div className="info col-md-8">
          <h2><Link to={`/product/${_.key}`}>{_.title}</Link></h2>
          <p dangerouslySetInnerHTML={{__html:_.shortDesc}}></p>
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
  ({ application: { products } }) => ({ products }),
  applicationActions
)(ProductOverview)
