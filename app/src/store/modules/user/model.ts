import produce from 'immer';

export interface IUser {
  uid: string | null;
  displayName: string | null;
}

const defaultUser: IUser = {
  uid: null,
  displayName: null
};

class User {
  /**
   * ログイン情報からユーザモデルを生成する
   *
   * @param user
   */
  static fromLoginInfo(user: IUser) {
    return produce(defaultUser, draft => {
      draft.uid = user.uid;
      draft.displayName = user.displayName;
    });
  }
}

export default User;
