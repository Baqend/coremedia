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

  fixRichtext (richtext) {
    const cssClasses = {
      'p--heading-1': 'h1',
      'p--heading-2': 'h2',
      'p--heading-3': 'h3',
    };
    if (richtext === null)
      return ''
    var s = richtext.replace(/^<div[^>]*>/, '').replace(/<\/div>$/, '')
    Object.keys(cssClasses).forEach(function (key) {
      var re = RegExp("class=\"" + key + "\"", "g");
      s = s.replace(re, "class=\"" + cssClasses[key] + "\"")
    });
    return s;
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
      <div>
        {product &&
        <div className="row">
          <div className="col-md-9">
            <h1>{ product.title }</h1>
          </div>
          <div class="col-md-3 pull-right text-right">
            <button className="btn btn-default" onClick={this.props.toggleComparison.bind(this, product)}>
              {buttonText}</button>
          </div>
        </div>
        }
        <div className="row">
          <div className="col-md-6" dangerouslySetInnerHTML={{__html:this.fixRichtext(product.longDesc)}}></div>
          <div className="col-md-6">
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
