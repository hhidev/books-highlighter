import { types } from './actions';
import User from './model';
import { ApiResponse } from '../../middleware/api-executor';

const UserReducer = (state: User = new User(), action: ApiResponse) => {
  switch (action.type) {
    case types.LOGIN_SUCCESS:
    case types.AUTHORIZE_SUCCESS:
      return User.fromLoginInfo(action.data);

    // case types.LOGOUT_SUCCESS:
    //   return new User();
    //
    // case types.FETCH_INFO_OK:
    //   return User.fetchAddonInfo(action.data);

    default:
      return state;
  }
};

export default UserReducer;
