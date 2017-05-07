import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { Link } from 'react-router';

import * as actions from '../actions';

export default class ViewDetail extends Component {

  render() {

    return (
      <div>
        <div className="nav-big">
          <div className="nav-title">Manage Member</div>
          <img src="/img/asskid.png" className="nav-big-photo" width="120px" height="120px" />
        </div>
        <img className="hamburger" src="/img/hamburger.svg" />
        <div style={{height: 20 + 'px'}}></div>
        <div style={{textAlign: 'center'}}>Noah</div>
        <div id="container-under" style={{marginTop: 20 + 'px'}}>
          <div className="r16">April, 2017</div>
          <div style={{height: 20 + 'px'}}></div>
          <img src="/img/viewdetail-example.png" style={{display: 'block', margin: '0 auto'}} width="297px" height="166px"/>
          <div style={{borderBottom: '1px solid #e3e3e3', width: '100%', height: '20px'}}></div>
          <div className="personal-transaction-container" style={{paddingLeft: '20px', paddingRight: '20px'}}>
            <div style={{height: 20 + 'px'}}></div>
            <div>Noah paid Jacob $20</div>
            <div className="transaction-record-text-date">5 days ago</div>
            <div style={{height: 10 + 'px'}}></div>
            <div>Noah paid Jacob $20</div>
            <div className="transaction-record-text-date">5 days ago</div>
          </div>
          <div style={{height: 20 + 'px'}}></div>
          <div className="myrow two-button">
            <Link to="/main_parent" >Manage</Link>
            <div style={{width: 15 + '%'}}></div>
            <button>View More</button>
          </div>
        </div>
      </div>
    );
  }
} // end of class

// function mapStateToProps(state) {
//   return { errorMsg: state.auth.error };
// }
//
//
// export default reduxForm({
//   form: 'LoginForm',
//   fields: ['username', 'password'],
//   validate
// }, mapStateToProps, actions )(IndexLogin);
