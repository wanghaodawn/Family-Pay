import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
// import { nameOfAnimation as Menu } from 'react-burger-menu';

class Header extends Component {

  render() {
    // // Define the sidebar content based on conditions (authenticated or not, parent or child)
    // var sidebarContent;
    // if (this.props.authenticated && this.props.user_type === 'child') {
    //   const sidebarContentAdmin = (
    //     <div>
    //       <Link className="nav-link"></Link>
    //       <Link className="nav-link"></Link>
    //       <Link className="nav-link"></Link>
    //     </div>
    //   );
    //   sidebarContent = sidebarContentAdmin;
    // }
    //
    // if (this.props.authenticated && this.props.user_type === 'parent') {
    //   const sidebarContentChild = (
    //     <div>
    //       <Link className="nav-link"></Link>
    //       <Link className="nav-link"></Link>
    //       <Link className="nav-link"></Link>
    //     </div>
    //   );
    //   sidebarContent = sidebarContentChild;
    // }


    // // There will be a constant header showing title and a ha
    // const contentHeader = (
    //   <span>
    //     {!this.state.sidebarOpen &&
    //      <a onClick={this.menuBtnClick.bind(this)}>=</a>}
    //      <span>Family Pay</span>
    //   </span>
    // );


    return (
      // <Menu>
      //   <a className="menu-item" href="/">Home</a>
      // </Menu>
      <div>
        Family Pay
      </div>
    )

  } // end render
} // end class

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    user_type: state.user.user_type,
  };
}

export default connect(mapStateToProps)(Header);
