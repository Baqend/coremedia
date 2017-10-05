import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import * as applicationActions from '../../actions/application'
import fixRichtext from '../../utils/coremedia-utils'
import { db } from 'baqend/realtime'

const properties = {
  'height' : 'Height',
  'width' : 'Width',
  'depth' : 'Depth',
  'weight': 'Weight'
}

class ProductComparison extends Component {

  static propTypes = {
    comparison: PropTypes.array.isRequired,
    toggleComparison: PropTypes.func.isRequired,
  };

  getImage(product){
    return product.mediaLinks && product.mediaLinks.length? `${CONNECT}/v1/code/img?id=${product.mediaLinks[0]}&width=269&height=269&v=2`: '';
  }

  render () {
    const { comparison } = this.props
    if(comparison.length == 0) {
      return (<div className="no-elements text-center">No elements in comparison.</div>)
    }
    const rows = Object.keys(properties).map(key => {
      return (<tr key={key}>
        <td>{properties[key]}</td>
        {comparison.map(product => {
          return (<td key={product.id}>{product[key]}</td>)
        })}
      </tr>)
    })

    const headers = comparison.map(product => {
      return (<th key={product.id}><Link to={`/product/${product.key}`}>{product.title}</Link></th>)
    })

    const images = comparison.map(product => {
      return (<td key={product.id}><img src={this.getImage(product)}/></td>)
    })

    const descriptions = comparison.map(product => {
      return (<td key={product.id} dangerouslySetInnerHTML={{__html:fixRichtext(product.shortDesc)}}></td>)
    })

    const removeButtons = comparison.map(product => {
      return (<td key={product.id}><button className="btn btn-default btn-sm" onClick={this.props.toggleComparison.bind(this, product)}>
        Remove</button></td>)
    });

    return (
      <div id='product-comparison' className="comparison">
        <div className="header"><h1>Product Comparison</h1></div>
        <table className="table table-striped table-hover">
          <tbody>
            <tr><th></th>{headers}</tr>
            <tr><td>Description</td>{descriptions}</tr>
            <tr><td></td>{images}</tr>
            {rows}
            <tr><td></td>{removeButtons}</tr>
          </tbody>
        </table>
      </div>
    )
    }

}

export default connect(
  ({ application: { comparison } }) => ({ comparison }),
  applicationActions
)(ProductComparison)
