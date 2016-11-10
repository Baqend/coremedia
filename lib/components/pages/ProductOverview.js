import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import * as applicationActions from '../../actions/application'

class ProductOverview extends Component {

  static propTypes = {
    products: PropTypes.array.isRequired,
    loadProducts: PropTypes.func.isRequired,
  };

  componentWillMount () {
    this.props.loadProducts()
    console.log("CWM" )
  }

  render () {
    const { products } = this.props
    console.log("Products", products)
    const productList = products.map(_ => <div key={_.id}>
      <h2>{_.title}</h2>
      <p dangerouslySetInnerHTML={{__html:_.shortDesc}}></p>
      <p><Link to={`/product/${_.key}`}>Details</Link></p>
    </div>)

    return (
    <div>
      <div className="header">
        <h1>Products</h1>
      </div>
      <div className="content">
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
