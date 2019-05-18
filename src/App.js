import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faClock, faFlag, faLightbulb, faSmile } from '@fortawesome/free-regular-svg-icons';
import { faCat, faCoffee, faFutbol, faMusic, faTrash } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import React from 'react';
import 'react-tabs/style/react-tabs.css';
import { ToastProvider } from 'react-toast-notifications';
import ReactTooltip from 'react-tooltip';
import styled, { createGlobalStyle } from 'styled-components';

import EmojiList from './EmojiList';
import EmojiSearchResults from './EmojiSearchResults';
import Search from './Search';

const RECENT_LENGTH = 25;
const RECENT_KEY = 'recentEmojis';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Montserrat', sans-serif;
  }

  button {
    background: #9FB7DF;
    padding: 0.5em;
    font-size: 0.8em;
    border-radius: 3px;
    cursor: pointer;
    font-weight: bold;
    border: none;
    color: #FFFFFF;
  }
`;

const Header = styled.header`
  background: #666666;
  color: #FFFFFF;
  padding: 0.5em;

  h1 {
    margin: 0;
  }
`;

const Main = styled.main`
  padding: 0.5em;
  max-width: 80em;
  margin: auto;
`;

const Instructions = styled.div`
  margin: 1em;
`;

const ToastBody = styled.div`
  font-size: 1.5em;
  padding: 0.5em;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.6);
  margin: 0.25em;
  color: #FFFFFF;
`;

const CustomToast = ({ children }) => (
  <ToastBody>
    {children}
  </ToastBody>
);

library.add(faBuilding, faCat, faClock, faCoffee, faFlag, faFutbol, faLightbulb, faMusic, faSmile, faTrash);

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      recent: []
    };

    this.clearRecent = this.clearRecent.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.onCopy = this.onCopy.bind(this);
  }

  componentDidMount() {
    try {
      const savedRecents = JSON.parse(localStorage.getItem(RECENT_KEY));
      if (savedRecents) {
        this.setState({
          recent: savedRecents
        });
      }
    } catch (e) {}

    window.addEventListener('beforeunload', () => {
      localStorage.setItem(RECENT_KEY, JSON.stringify(this.state.recent));
    });
  }

  clearRecent() {
    this.setState({
      recent: []
    });
  }
  
  onCopy(emoji) {
    this.setState({
      recent: [
        emoji,
        ...this.state.recent.filter(e => e !== emoji)
      ].slice(0, RECENT_LENGTH)
    });
  }

  doSearch(searchQuery) {
    this.setState({
      search: searchQuery
    });

    setTimeout(() => {
      ReactTooltip.rebuild();
    })
  }

  render() {
    return (
      <ToastProvider placement="top-center" autoDismissTimeout={2000} components={{ Toast: CustomToast }}>
        <ReactTooltip effect="solid" />
        <div>
          <GlobalStyle />
          <Header>
            <h1><FontAwesomeIcon icon={['far', 'smile']} /> Emoji Picker</h1>
          </Header>
          <Main>
            <Search onSearch={this.doSearch} />
            <Instructions>
              Click on an emoji to copy it to the clipboard.
            </Instructions>
            {this.state.search ? <EmojiSearchResults searchQuery={this.state.search} onCopy={this.onCopy} /> : <EmojiList onCopy={this.onCopy} recent={this.state.recent} onClearRecent={this.clearRecent} />}
          </Main>
        </div>
      </ToastProvider>
    );
  }
}
