import { IUser } from './model';

export enum types {
  LOGIN = 'user/LOGIN',
  LOGIN_SUCCESS = 'user/LOGIN/SUCCESS',
  LOGIN_FAILED = 'user/LOGIN/FAILED',
  AUTHORIZE = 'user/AUTHORIZE',
  AUTHORIZE_SUCCESS = 'user/AUTHORIZE/SUCCESS',
  AUTHORIZE_FAILED = 'user/AUTHORIZE/FAILED',
  LOGOUT = 'user/LOGOUT',
  LOGOUT_SUCCESS = 'user/LOGOUT/SUCCESS',
  FETCH_INFO = 'user/FETCH_INFO',
  FETCH_INFO_OK = 'user/FETCH_INFO/OK',
  FETCH_INFO_NG = 'user/FETCH_INFO/NG'
}

export const logout = () => ({
  type: types.LOGOUT_SUCCESS
});

// ログイン成功時
export const loginSuccess = (data: firebase.UserInfo) => ({
  type: types.LOGIN_SUCCESS,
  data: data
});

// 追加情報取得成功時
export const fetchAddonInfoSuccess = (data: IUser) => ({
  type: types.FETCH_INFO_OK,
  data: data
});
