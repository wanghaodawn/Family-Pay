import {CHILDREN_INFO} from '../actions/types';

export default function(state = {}, action) {
  switch(action.type) {
    case CHILDREN_INFO:
      return {...state, children: action.payload};
  }

  return state;
}
