import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import {PARENT, CHILD} from '../actions/types';
import MainParent from './main_parent';
import MainChild from './main_child';

class Main extends Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    console.log("main", this.props.user_type);
    console.log("main props", this.props);
    // // Adult
    // if (this.props.authenticated && this.props.user_type === PARENT) {
    //   return (
    //     <MainParent />
    //   )
    // }
    // // Child
    // else if (this.props.authenticated && this.props.user_type === CHILD) {
    //   return (
    //     <MainChild />
    //   )
    // }


    // test
    return (
      <MainParent />
    )
    // test
    // return (
    //   <MainChild />
    // )
  }; // end render
} // end class

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    user_type: state.user.user_type,
  };
}

export default connect(mapStateToProps)(Main);
