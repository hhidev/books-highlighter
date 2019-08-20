import produce from 'immer';

export interface IUser {
  uid: string | null;
  displayName: string | null;
}

// const UserRecord = Record<IUser>({
//   uid: null,
//   email: null,
//   mail: null,
//   displayName: null,
//   phoneNumber: null,
//   photoURL: null,
//   providerId: null,
//   currentPoint: null,
//   stamps: null,
//   imageUrl: null,
//   rewards: null
// });

const defaultUser = {
  uid: null,
  displayName: null
};

class User {
  /**
   * ログイン情報からユーザモデルを生成する
   *
   * @param user
   */
  static fromLoginInfo(user: firebase.UserInfo) {
    return produce(defaultUser, draft => {
      draft.uid = user.uid;
      draft.displayName = user.displayName;
    });
  }

  // /**
  //  * ユーザ追加情報をセット
  //  * @param user
  //  */
  // static fetchAddonInfo(user: IUser) {
  //   return new this().withMutations(record => {
  //     record
  //       .set('uid', user.uid)
  //       .set('mail', user.mail)
  //       .set('displayName', user.displayName)
  //       .set('currentPoint', user.currentPoint)
  //       .set('stamps', user.stamps)
  //       .set('imageUrl', user.imageUrl)
  //       .set('rewards', List(user.rewards));
  //   })
  // }
}

export default User;
