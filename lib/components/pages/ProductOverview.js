import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import * as applicationActions from '../../actions/application'

class ProductOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      term: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  static propTypes = {
    products: PropTypes.array.isRequired,
    loadProducts: PropTypes.func.isRequired,
  };

  componentWillMount () {
    this.props.loadProducts()
    console.log("CWM" )
  }

  handleChange (event) {
    this.setState({term: event.target.value});
  }

  handleSubmit(event) {
    console.log('search with ', this.state.term)
    event.preventDefault();
    //this.props.searchProduct(this.state.term)
  }

  render () {
    const { products } = this.props
    console.log("Products", products)
    const productList = products.map(_ => <div className="product col-md-9 col-md-offset-3" key={_.id}>
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
        <form onSubmit={this.handleSubmit}>
          <div className="col-md-offset-3 col-md-9 input-group">
            <input type="text" name="term" className="form-control" value={this.state.value}
                   onChange={this.handleChange} placeholder="Search for..."/>
            <span className="input-group-btn">
              <button className="btn btn-default" type="submit">Go!</button>
            </span>
          </div>
        </form>
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
