import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as applicationActions from '../../actions/application'

class ProductDetails extends Component {

  static propTypes = {
    product: PropTypes.object.isRequired,
    comparison: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired,
    loadProduct: PropTypes.func.isRequired,
    toggleComparison: PropTypes.func.isRequired,
  }

  componentWillMount () {
    this.props.loadProduct(this.props.params.id)
  }

  isInComparison (product) {
    return this.props.comparison.indexOf(product) != -1
  }

  render () {
    const { product, comparison } = this.props
    const buttonText = this.isInComparison(product) ? "Remove from Comparison" : "Add to Comparison"
    console.log("Comparison", comparison);

    return (
      <div>
        {product &&
          <div className="row">
            <div className="header">
              <h1>{ product.title }</h1>
              <button className="btn btn-default" onClick={this.props.toggleComparison.bind(this, product)}>
                {buttonText}</button>
            </div>
            <div className="row">
              <div className="col-md-6">
                { product.longDesc }
              </div>
            </div>
            </div>
          }
      </div>
    )
  }

}

export default connect(
  ({application: {product, comparison}}) => ({product, comparison}),
  applicationActions
)(ProductDetails)
