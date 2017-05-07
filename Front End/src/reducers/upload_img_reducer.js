import {FILE, BASE46} from '../actions/types';

export default function(state = {}, action) {
  switch(action.type) {
    case FILE:
      return {...state, file: action.payload};
  }

  return state;
}
