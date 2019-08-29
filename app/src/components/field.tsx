import * as React from 'react';

interface Props {
  label: string;
  name: string;
  value: any;
  isError?: boolean;
  onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Field: React.FunctionComponent<Props> = props => {
  return (
    <div className="field">
      <label className="label">{props.label}</label>
      <div className="control">
        <input
          className={props.isError ? 'input is-danger' : 'input'}
          type="text"
          name={props.name}
          value={props.value}
          onChange={props.onChangeHandler}
        />
        {props.isError && (
          <span className="help is-danger">{props.label}は必須です</span>
        )}
      </div>
    </div>
  );
};

export default Field;
