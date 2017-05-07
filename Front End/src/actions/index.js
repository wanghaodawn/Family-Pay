import axios from 'axios';
import { browserHistory } from 'react-router';

import { AUTH_USER, UNAUTH_USER, AUTH_ERROR, FILE, CHILDREN_INFO, SPENT, LIMIT, PARENT, CHILDREN } from './types';

import request from 'superagent';

// Action type
export const LOGIN = 'LOGIN';

const ROOT_URL = 'http://10.141.95.142:3000/api';

export function loginAction({ username, password }) {
  return function(dispatch) {
    axios.post(`${ROOT_URL}/login`, { username, password })
      .then(response => {
        console.log('message', response.message);
        // request is good,
        //   - save token
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('token', response.data.token);
        //   - redirect to /face_login
        browserHistory.push('/face_login');
      })
      .catch((error) => {
        // If request is bad...
        // - Show an error to the user
        // dispatch(authError('The username or password is wrong'));
        // dispatch(authError(error));
        alert('The username or password is wrong');
      });
  }
}

export function uploadImg(file) {
  return {
    type: FILE,
    payload: file
  }
}

export function faceLogin(file) {
  // username = 'whdawn'; // to be deleted
  return function(dispatch) {
    console.log("face login");
    // console.log("username", username);
    console.log("file", file);
    // axios.post(`${ROOT_URL}/compare_faces`,
    //   { username, image },
    //   // {headers: {'Content-Type': 'multipart/form-data'}}
    // )
      // .then(response => {
      //   if (response.message === 'Success') {
      //     console.log("faceLogin res", response);
      //     //   - update state to indicate that user is authenticated
      //     dispatch({ type: AUTH_USER });
      //     //   - update state to indicate the type of the user
      //     //   check
      //     let user_type = response.user_type;
      //     dispatch({ type: user_type.toUpperCase() });
      //     //   - save first name
      //     //   check
      //     localStorage.setItem('firstName', response.data.firstName);
      //     //   - redirect to main scene
      //     browserHistory.push('/main');
      //   } else {
      //     dispatch(authError('You don\'t seem to be a registered user'));
      //   }
      // })
    //   .catch(() => {
    //     alert('You don\'t seem to be a registered user');
    //   });

    var req=request
              .post('http://10.141.95.142:3000/api/insert_image')
              .send(file);
    req.end(function(err, response) {
      // if (response.message === 'Success') {
        console.log("faceLogin res", response);
        //   - update state to indicate that user is authenticated
        dispatch({ type: AUTH_USER });
        //   - update state to indicate the type of the user
        // let user_type = response.user_type;
        // dispatch({ type: user_type.toUpperCase() });
        dispatch({ type: PARENT });
        // //   - save first name
        // localStorage.setItem('name', response.data.name);
        console.log(response.children);
        // Check if there's any children
        if (response.children) {
          //   - update all chidlren list info
          dispatch(allChildren(response.children));
          //   - redirect to main scene
          browserHistory.push('/main');
        }
        else {
          browserHistory.push('/add_member');
        }

      // } else {
      //   dispatch(authError('You don\'t seem to be a registered user'));
      // }
    });
  }
}

export function facePay(file) {
  // username = 'whdawn'; // to be deleted
  return function(dispatch) {
    console.log("face login");
    // console.log("username", username);
    console.log("file", file);
    var req=request
              .post('http://10.141.95.142:3000/api/compare_faces')
              .send(file);
    req.end(function(err, response) {
      if (response.message === 'Success') {
        console.log("faceLogin res", response);
        //   - update state to indicate that user is authenticated
        dispatch({ type: AUTH_USER });
        //   - update state to indicate the type of the user
        // let user_type = response.user_type;
        // dispatch({ type: user_type.toUpperCase() });
        dispatch({ type: PARENT });
        //   - save first name
        localStorage.setItem('name', response.data.name);
        // Check if there's any children
        if (response.children) {
          //   - update all chidlren list info
          dispatch(allChildren(response.children));
          //   - redirect to main scene
          browserHistory.push('/main');
        }
        else {
          browserHistory.push('/add_memeber');
        }

      } else {
        dispatch(authError('You don\'t seem to be a registered user'));
      }
    });
  }
}


// inputs: file, username, childName, quota, limit
export function addMember(file) {
  return function(dispatch) {
    console.log("add member");
    console.log("file", file);
    var req=request
              .post('http://10.141.95.142:3000/api/add_memeber')
              .send(file);
    req.end(function(err, response) {
      if (response.message === 'Success') {
        console.log("addMemeber res", response);

        //   - redirect to main scene
        browserHistory.push('/main');
      } else {
        dispatch(authError('You don\'t seem to be a registered user'));
      }
    });
  }
}

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  }
}

export function allChildren(children) {
  return {
    type: CHILDREN_INFO,
    payload: children
  }
}

export function fetchMessage() {
  return function(dispatch) {
    axios.get(ROOT_URL, {
      headers: { authorization: localStorage.getItem('token') }
    })
      .then(response => {
        dispatch({
          type: SPENT,
          payload: response.data.spent,
        });
        dispatch({
          type: LIMIT,
          payload: response.data.limit,
        });
      });
  }
}
