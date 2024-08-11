import React, {useContext, useState} from 'react';
import './App.css';
import WordDisplay from "./components/WordDisplay";
import Header from "./components/Header";
import {Context} from "./index";
import ResultScreen from "./components/ResultScreen";
import {observer} from "mobx-react-lite";


function App() {
  const {wordStore} = useContext(Context)
  const [lang, setLang] = useState<boolean>(true)

  const swapLang = () => {
      setLang(!lang)
  }

  return (
    <div className="App">
      <Header/>
      {wordStore.isEnd ? <ResultScreen lang={lang} swapLang={swapLang}/> : <WordDisplay lang={lang} swapLang={swapLang}/>}
    </div>
  );
}

export default observer(App);
