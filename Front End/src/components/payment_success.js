import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { Link } from 'react-router';

import * as actions from '../actions';

export default class PaymentSuccess extends Component {

  render() {

    return (
      <div>
        <div className="nav">
          Payment Success
        </div>
        <img className="hamburger" src="/img/hamburger.svg" />
        <div id="container-under">
          <div style={{height: 70 + 'px'}}></div>
          <div className="transaction-container">
              <div style={{'text-align': 'center;'}}> Your request has been sent </div>
              <div style={{'text-align': 'center;'}}> Please wait for the response </div>
              <div style={{height: 40 + 'px'}}></div>
              {/* <button type="submit" className="primary-button">
                Done
              </button> */}
              <Link to="/main_child" className="primary-button">Done</Link>
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
