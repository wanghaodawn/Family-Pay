import {SPENT, LIMIT} from '../actions/types';

export default function(state = {}, action) {
  switch(action.type) {
    case SPENT:
      return {...state, spent: action.payload};
    case LIMIT:
      return {...state, limit: action.payload};
  }

  return state;
}
