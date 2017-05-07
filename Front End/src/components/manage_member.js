import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { Link } from 'react-router';

import * as actions from '../actions';

export default class ManageMember extends Component {

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
        <div id="container-under" style={{marginTop: '10px'}}>
          <div className="row">
            <div className="col-xs-1 col-sm-1">
              <img src="/img/ring.svg" />
            </div>
            <div className="col-xs-10 col-sm-10">
              <div className="r16b">Requesting a $32,999 purchase:</div>
              <div className="t14b">Mom I want a new car. Please!</div>
              <div style={{height: 15 + 'px'}}></div>
            </div>
          </div>
          <div className="myrow two-button">
            <button>Approve</button>
            <div style={{width: 15 + '%'}}></div>
            <button>Decline</button>
          </div>
          <div style={{height: 30 + 'px'}}></div>
          <div style={{marginLeft: '10%'}}>Monthly Quota of This Member</div>
          <div style={{height: 10 + 'px'}}></div>
          <input type="text" className="form-control myinput input-in-app" placeholder="Monthly Quota" autoComplete="off" />
          <div style={{height: 42 + 'px'}}></div>
          <div style={{marginLeft: '10%'}}>Max One-Time Spending Limit</div>
          <div style={{height: 10 + 'px'}}></div>
          <input type="text" className="form-control myinput input-in-app" placeholder="One-Time Limit" autoComplete="off" />
          <div style={{height: 40 + 'px'}}></div>
          <Link to="/main_parent" className="primary-button">Done</Link>

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
