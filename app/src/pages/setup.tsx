import * as React from 'react';
import { db } from '../firebase';
import { connect } from 'react-redux';
import { IUser } from '../store/modules/user';
import { RouterProps } from 'react-router';

interface Props {
  user: IUser;
}

interface FormData {
  title: string;
  public: boolean;
  uid: string;
}

const Setup: React.FunctionComponent<Props & RouterProps> = props => {
  const [formData, setFormData] = React.useState<FormData>({
    title: `${props.user.displayName}の本棚`,
    public: false,
    uid: props.user.uid
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRadioChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name === 'public') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, public: !checked });
    }
  };

  const submit = async () => {
    await db
      .collection('shelves')
      .add(formData)
      .then(docRef => {
        props.history.push(`/${docRef.id}`);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div className={'container is-fluid'}>
      <div className={'columns is-centered'}>
        <div className={'column is-half'}>
          <div className={'hero'}>
            <div className="hero-body">
              <div className="container has-text-centered">
                <h1 className="title">Welcome!</h1>
                <h2 className="subtitle">まず本棚を作りましょう</h2>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label">本棚のタイトル</label>
            <div className="control">
              <input
                className="input"
                name={'title'}
                type="text"
                value={formData.title}
                onChange={e => handleInputChange(e)}
              />
            </div>
          </div>

          <div className="field">
            <div className="control">
              <label className="radio">
                <input
                  type="radio"
                  name="public"
                  checked={formData.public}
                  onChange={e => handleRadioChecked(e)}
                />
                公開
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="private"
                  checked={!formData.public}
                  onChange={e => handleRadioChecked(e)}
                />
                非公開
              </label>
            </div>
          </div>

          <div className="field is-grouped is-grouped-right">
            <div className="control">
              <button className={'button is-primary'} onClick={submit}>
                登録する
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(Setup);
