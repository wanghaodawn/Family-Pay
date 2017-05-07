import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { Link } from 'react-router';

import * as actions from '../actions';

class MainParent extends Component {

  render() {

    return (
      <div>
        <div className="nav">
          FamilyPay
        </div>
        <img className="hamburger" src="/img/hamburger.svg" />
        <div id="container-under">
          <div style={{height: 20 + 'px'}}></div>
          <div className="r16">PNC Checking (..9999)</div>
          <div style={{height: 20 + 'px'}}></div>
          <div className="a-member">
            <div className="row">
              <div className="col-xs-3 col-sm-3">
                <img className="member-photo-md" src="" width="60px" height="60px" />
              </div>
              <div className="col-xs-9 col-sm-9" style={{padding: 0 + 'px'}}>
                <div style={{height: 5 + 'px'}}></div>
                <div>
                  <span>Noah</span>
                  <span>&ensp;&ensp;&ensp;</span>
                  <span className="l16d">1 Request</span>
                </div>
                <div style={{height: 10 + 'px'}}></div>
                <div className="row">
                  <div className="col-xs-2 t16">0&ensp;&ensp;&ensp;</div>
                  <div className="col-xs-7 bar">
                    <div className="inner-bar r14w">$300</div>
                  </div>
                  <div className="col-xs-2 t16">1000</div>
                </div>
              </div>
            </div>
            <div style={{height: 20 + 'px'}}></div>
            <div className="myrow two-button">
              <Link to="/manage_member" >Manage</Link>
              <div style={{width: 15 + '%'}}></div>
              <Link to="/view_detail" >View Detail</Link>
            </div>
            <div style={{height: 20 + 'px'}}></div>
          </div>
          <div style={{height: 20 + 'px'}}></div>
          <div className="transaction-container">
            <div className="r16">Transaction History</div>
            <div style={{height: 16 + 'px'}}></div>
            <div className="row">
              <div className="col-xs-2">
                <img src="" className="transaction-photo" width="40px" height="40px" />
              </div>
              <div className="col-xs-10 transaction-record-text">
                <div>Noah paid Jacob $20</div>
                <div className="transaction-record-text-date">5 days ago</div>
                <div style={{height: 11 + 'px'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
} // end of class

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    user_type: state.user.user_type,
  };
}

export default connect(mapStateToProps)(MainParent);
