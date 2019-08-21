import { types } from './actions';
import User from './model';
import { ApiResponse } from '../../middleware/api-executor';

const UserReducer = (state: User = new User(), action: ApiResponse) => {
  switch (action.type) {
    case types.LOGIN_SUCCESS:
    case types.AUTHORIZE_SUCCESS:
      return User.fromLoginInfo(action.data);

    default:
      return state;
  }
};

export default UserReducer;
