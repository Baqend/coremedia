import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as applicationActions from '../../actions/application'
import fixRichtext from '../../utils/coremedia-utils'
import { db } from 'baqend/streaming'

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

  getImage(product){
    return product.mediaLinks && product.mediaLinks.length? new db.File(product.mediaLinks[0]).url : 'http://www.myiconfinder.com/uploads/iconsets/256-256-323c59a9f2afd00a83d41dcf738c5978.png'
  }

  render () {
    const { product, comparison } = this.props
    const buttonText = this.isInComparison(product) ? "Remove from Comparison" : "Add to Comparison"

    var properties = ['height', 'width', 'depth', 'weight', 'burners', 'hobConfig', 'fuel']
    const rows = properties.map(key => {
      var value = product[key] ? product[key] : "\u2014"
      return (<tr key={key}>
        <th>{key}</th>
        <td key={product.id}>{value}</td>
      </tr>)
    })

    return (
      <div id="product-detail">
        {product &&
        <div className="row header">
          <div className="col-md-9">
            <h1>{ product.title }</h1>
          </div>
          <div className="col-md-3 pull-right text-right">
            <button className="btn btn-default" onClick={this.props.toggleComparison.bind(this, product)}>
              {buttonText}</button>
          </div>
        </div>
        }
        <div className="row">
          <div className="col-md-6" dangerouslySetInnerHTML={{__html:fixRichtext(product.longDesc)}}></div>
          <div className="col-md-6">
            <img src={this.getImage(product)}/>
            <h3>Technical Specifications</h3>
            <table className="table table-bordered table-hover">
              <tbody>
                {rows}
              </tbody>
            </table>
        </div>
        </div>
      </div>
    )
  }

}

export default connect(
  ({application: {product, comparison}}) => ({product, comparison}),
  applicationActions
)(ProductDetails)
