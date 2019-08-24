import * as React from 'react';

interface Props {
  label: string;
  name: string;
  value: any;
  onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Field: React.FunctionComponent<Props> = props => {
  return (
    <div className="field">
      <label className="label">{props.label}</label>
      <div className="control">
        <input
          className="input"
          type="text"
          name={props.name}
          value={props.value}
          onChange={props.onChangeHandler}
        />
      </div>
    </div>
  );
};

export default Field;
