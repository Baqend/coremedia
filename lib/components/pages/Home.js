import React from 'react'
import { Link } from 'react-router'

export default function Home () {
  return (
    <div>
      <div className="home">
          <h1><small>Welcome to </small><br/> Baqend <i className="fa fa-heart"></i> Actian</h1>
          <Link to="/products" className="btn btn-primary btn-lg">To Shop ></Link>
      </div>
      <div className="content">
      </div>
    </div>
  )
}
