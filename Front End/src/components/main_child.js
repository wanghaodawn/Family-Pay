import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { Link } from 'react-router';

import * as actions from '../actions';

class MainChild extends Component {
  componentWillMount() {
    this.props.fetchMessage();
  }

  render() {
    return (
      <div>
        <div className="nav-big">
          <div className="nav-title">Noah</div>
          <img src="/img/asskid.png" className="nav-big-photo" width="120px" height="120px" />
        </div>
        <img className="hamburger" src="/img/hamburger.svg" />
        <div style={{height: 20 + 'px'}}></div>
        <div style={{textAlign: 'center'}}>Noah</div>
        <div id="container-under" style={{marginTop: '20px'}}>
          <div style={{textAlign: 'center'}}>You have spent 300 out of 1000</div>
          <div style={{height: 20 + 'px'}}></div>
          <div className="row">
            <div className="col-xs-2 t16">0&ensp;&ensp;&ensp;</div>
            <div className="col-xs-8 bar">
              <div className="inner-bar r14w">$300</div>
            </div>
            <div className="col-xs-2 t16">1000</div>
          </div>
          <div style={{height: 20 + 'px'}}></div>
          <div className="myrow two-button">

            <Link to="/payment_success" style={{width: '120px'}}>Make Payment</Link>

            <div style={{width: 15 + '%'}}></div>
            <button style={{width: '120px'}}>Send Request</button>
          </div>
          <div style={{height: 20 + 'px', borderBottom: '1px solid #e6e6e6'}}></div>
          <div style={{height: 20 + 'px'}}></div>
          <div className="personal-transaction-container" style={{paddingLeft: '20px', paddingRight: '20px'}}>
            <div>You paid Jacob $20</div>
            <div className="transaction-record-text-date">5 days ago</div>
            <div style={{height: 10 + 'px'}}></div>
            <div>You spent $20 on Amazon</div>
            <div className="transaction-record-text-date">8 days ago</div>
            <div style={{height: 10 + 'px'}}></div>
            <div>You spent $10 at Giant Eagle</div>
            <div className="transaction-record-text-date">10 days ago</div>
          </div>

        </div>
      </div>
    )
  }; // end render
} // end class

// function mapStateToProps(state) {
//   return {
//     authenticated: state.auth.authenticated,
//     user_type: state.user.user_type,
//     spent : state.childData.spent,
//     limit: state.childData.limit,
//   };
// }

// export default connect(mapStateToProps, actions)(MainChild);
export default connect(null, actions)(MainChild);
