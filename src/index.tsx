import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {WordStore} from "./store/WordStore";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

interface State {
    wordStore: WordStore
}

export const wordStore = new WordStore()
export const Context = createContext<State>({
    wordStore
})


root.render(
  <Context.Provider value={{
      wordStore
  }}>
    <App />
  </Context.Provider>
);


