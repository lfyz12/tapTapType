import React, {useContext, useState, useCallback} from 'react';
import './App.css';
import WordDisplay from "./components/WordDisplay";
import StartScreen from "./components/StartScreen";
import {Context} from "./index";
import ResultScreen from "./components/ResultScreen";
import {observer} from "mobx-react-lite";

type Screen = 'start' | 'playing';

function App() {
  const {wordStore} = useContext(Context);
  const [screen, setScreen] = useState<Screen>('start');
  const [lang, setLang] = useState<boolean>(true);
  const [mode, setMode] = useState<'words' | 'sentences'>('words');
  const [selectedTime, setSelectedTime] = useState<number>(30);

  const swapLang = useCallback((newLang?: boolean) => {
    setLang(prev => newLang !== undefined ? newLang : !prev);
  }, []);

  const startGame = useCallback(async () => {
    wordStore.setTime(selectedTime);
    wordStore.reset();
    if (lang) {
      await wordStore.getEnglishWords(60);
    } else {
      if (mode === 'sentences') {
        await wordStore.getRussianWords(3);
      } else {
        await wordStore.getRussianWordsAsWords(60);
      }
    }
    setScreen('playing');
  }, [lang, mode, selectedTime, wordStore]);

  const goToStart = useCallback(() => {
    wordStore.reset();
    setScreen('start');
  }, [wordStore]);

  return (
    <div className="App">
      {screen === 'start' && (
        <StartScreen
          lang={lang}
          swapLang={swapLang}
          mode={mode}
          setMode={setMode}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          startGame={startGame}
        />
      )}
      {screen === 'playing' && !wordStore.isEnd && (
        <WordDisplay
          lang={lang}
          selectedTime={selectedTime}
          startGame={startGame}
        />
      )}
      {wordStore.isEnd && (
        <ResultScreen
          startGame={startGame}
          goToStart={goToStart}
        />
      )}
    </div>
  );
}

export default observer(App);
