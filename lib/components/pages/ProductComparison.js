import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import * as applicationActions from '../../actions/application'

class ProductComparison extends Component {

  static propTypes = {
    comparison: PropTypes.array.isRequired,
  };

  render () {
    const { comparison } = this.props
    if(comparison.length == 0) {
      return (<div>No elements in comparison.</div>)
    }
    var properties = ['title', 'height', 'width', 'depth', 'weight']
    const rows = properties.map(key => {
      return (<tr key={key}>
        <td>{key}</td>
        {comparison.map(product => {
          return (<td key={product.id}>{product[key]}</td>)
        })}
      </tr>)
    })
    console.log(rows)

    return (
      <div>
        <h1>Product Comparison</h1>
        <table className="table">
          {rows}
        </table>
      </div>
    )
    }

}

export default connect(
  ({ application: { comparison } }) => ({ comparison }),
  applicationActions
)(ProductComparison)
