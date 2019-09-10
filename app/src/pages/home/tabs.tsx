import * as React from 'react';

interface TabProps {
  isMobile: boolean;
  changeTab: (nextTabName: string) => void;
}

interface PanelProps {
  tabName: string;
  children: React.ReactNode;
}

const TabContext = React.createContext({
  activeTabName: 'ハイライト'
});

const Tab: React.FunctionComponent<TabProps> = props => {
  const context = React.useContext(TabContext);
  return (
    <div
      className={
        props.isMobile ? 'tabs is-small is-fullwidth' : 'tabs is-small'
      }
    >
      <ul>
        <li
          className={context.activeTabName === 'ハイライト' ? 'is-active' : ''}
        >
          <a onClick={e => props.changeTab('ハイライト')}>
            ハイライト
            <span style={{ height: '2em' }} />
          </a>
        </li>
        <li className={context.activeTabName === '解析済み' ? 'is-active' : ''}>
          <a onClick={e => props.changeTab('解析済み')}>
            解析済み
            <span style={{ height: '2em' }} />
          </a>
        </li>
      </ul>
    </div>
  );
};

export const TabPanel = (props: PanelProps) => {
  const context = React.useContext(TabContext);
  console.log(props);
  return props.tabName === context.activeTabName ? <>{props.children}</> : null;
};

const TabSwitcher: React.FunctionComponent<{ isMobile: boolean }> = props => {
  const [activeTabName, changeTab] = React.useState('ハイライト');

  return (
    <TabContext.Provider value={{ activeTabName }}>
      <Tab isMobile={props.isMobile} changeTab={changeTab} />
      {props.children}
    </TabContext.Provider>
  );
};

export default TabSwitcher;
