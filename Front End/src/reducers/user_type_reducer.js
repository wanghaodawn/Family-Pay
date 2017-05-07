import {PARENT, CHILD} from '../actions/types';

export default function(state = {}, action) {
  switch(action.type) {
    case PARENT:
      return {...state, user_type: PARENT};
    case CHILD:
      return {...state, user_type: CHILD};
  }

  return state;
}
