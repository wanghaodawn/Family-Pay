import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import Dropzone from 'react-dropzone';
import { Link } from 'react-router';

import * as actions from '../actions';

class AddMember extends Component {

  onDrop(files) {
    var file = new FormData();
    let username = localStorage.getItem('username');
    file.append('name', files[0], username);
    let fileContent = file.get('name');
    // Check size
    if (fileContent.size/1024/1024 >= 2) {
      alert("Image is too big! Please upload an image that's less than 2MB");
      file.delete('name', files[0]);
      console.log('file after delete', file.get('name'));
    } else {
      this.props.uploadImg(file);
    }
  }

  onSubmit({name, quota, limit}) {
    console.log("onsubmit");
    console.log("file", this.props.file);
    if (this.props.file) {
      let file = this.props.file;
      let fileContent = file.get('name');
      fileContent.childName = name;
      fileContent.quota = quota;
      fileContent.limit = limit;
      fileContent.user_type = 'Child';
      console.log('file content', fileContent);
      this.props.addMember(file);
    }
    else {
      alert("No image has been loaded yet");
    }
  }

  render() {
    var imgSrc = "/img/user2.png";
    if (this.props.file) {
      imgSrc = "/img/checkmark.png";
    }

    const { handleSubmit } = this.props;
    const { fields: {name, quota, limit} } = this.props;

    return (
      <div>
        <div className="nav-big">
          <div className="nav-title">Add Member</div>
            <img src={imgSrc} className="nav-big-photo" />
        </div>
        <img className="hamburger" src="/img/hamburger.svg" />


        <div>
          <form
            className="form-non-style"
            onSubmit={ handleSubmit(this.onSubmit.bind(this)) }>
            <Dropzone
              className="nav-big-photo"
              onDrop={this.onDrop.bind(this)} >
            </Dropzone>

            <div id="container-under">
              <input type="text"
                className="form-control myinput input-in-app"
                placeholder="Member's Name"
                autoComplete="off"
                {...name}/>

              <div style={{height: 52 + 'px'}}></div>
              <div style={{marginLeft: '10%'}}>Monthly Quota of This Member</div>
              <div style={{height: 10 + 'px'}}></div>
              <input type="number"
                className="form-control myinput input-in-app"
                placeholder="Monthly Quota"
                autoComplete="off"
                {...quota}/>

              <div style={{height: 52 + 'px'}}></div>
              <div style={{marginLeft: '10%'}}>Max One-Time Spending Limit</div>
              <div style={{height: 10 + 'px'}}></div>
              <input type="number"
                className="form-control myinput input-in-app"
                placeholder="One-Time Limit"
                autoComplete="off"
                {...limit}/>

              {/* <button
                className="primary-button add_member_done">
                Done
              </button> */}

              <Link to="/main_parent" className="primary-button add_member_done">Done</Link>
            </div>

          </form>

        </div>
      </div>
    );
  }
} // end of class

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    errorMsg: state.auth.error,
    file: state.file.file,
  };
}


export default reduxForm({
  form: 'FaceLoginForm',
  fields: ['name', 'quota', 'limit'],
}, mapStateToProps, actions )(AddMember);
