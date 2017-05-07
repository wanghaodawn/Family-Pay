import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import Dropzone from 'react-dropzone';
import request from 'superagent';

import * as actions from '../actions';

class FaceLogin extends Component {
  static contextTypes = {
    router: PropTypes.object
  };

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

  onSubmit() {
    console.log("onsubmit");
    console.log("file", this.props.file);
    if (this.props.file) {
      let file = this.props.file;
      this.props.faceLogin(file);
    }
    else {
      alert("No image has been loaded yet");
    }
  }


  renderTitle() {
    // no loaded image
    if (!this.props.file) {
      return (
        <div>
          <div id="facerecogfirst-hello">Hello,</div>
          <div id="facerecogfirst-hello1">You can login with your face now!</div>
        </div>
      )
    }
    // loaded image
    else {
      return (
        <div>
          <div id="facerecogfirst-hello">Perfect!</div>
          <div id="facerecogfirst-hello1">Let&prime;s upload it!</div>
        </div>
      )
    }
  }

  render() {
    const { handleSubmit } = this.props;
    const { fields: {image} } = this.props;
    var imgSrc = "/img/default-user-avatar.svg";
    if (this.props.file) {
      imgSrc = "/img/checkmark.png";
    }
    console.log('imgSrc', imgSrc);

    return (
      <div id="inner-container">

        { this.renderTitle() }

        <img id="default-user-avatar" className="img-circle" src={imgSrc} />
        <div style={{height: 70 + 'px'}}></div>
        <div className="primary-button-upload">
          <label>
            <div className="primary-button-upload">Select Photo</div>
            <Dropzone onDrop={this.onDrop.bind(this)} style={{display: 'none'}}>
              <div>drop</div>
            </Dropzone>
          </label>
        </div>
        <div style={{height: 20 + 'px'}}></div>

        <button type="submit" className="primary-button" onClick={this.onSubmit.bind(this)}>
          Upload
        </button>



      </div>
    ) // end of return
  } // end of render
} // end of class


function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    errorMsg: state.auth.error,
    file: state.file.file
  };
}


export default reduxForm({
  form: 'FaceLoginForm',
  fields: ['img'],
}, mapStateToProps, actions )(FaceLogin);
