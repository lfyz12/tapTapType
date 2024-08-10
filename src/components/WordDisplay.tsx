import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import WordItem from "./WordItem";
import {ITypeWord} from "../store/WordStore";

const WordDisplay = () => {
    const {wordStore} = useContext(Context)

    const [lang, setLang] = useState<boolean>(true)
    const [typingText, setTypingText] = useState<string>('')
    const getRussianWords = async () => {
        await wordStore.getRussianWords(5)
    }

    const getEnglishWords = async () => {
        await wordStore.getEnglishWords(60)
    }


    const keyHandler = (e: React.KeyboardEvent) => {
        const inputChar = e.key
        wordStore.checkTypeChar(inputChar)
    }


    useEffect(() => {
        lang ? getEnglishWords() : getRussianWords()
    }, [lang]);


    return (
        <div onKeyPress={keyHandler} tabIndex={0}  className='w-100 flex flex-wrap'>
            <button className='' onClick={() => setLang(!lang)}>{lang ? 'en' : 'ru'}</button>
            {/*<input*/}
            {/*    tabIndex={0}*/}
            {/*    type='text'*/}
            {/*    value={typingText}*/}
            {/*    onChange={e => setTypingText(e.target.value)}*/}
            {/*    onKeyPress={keyHandler}/>*/}
            {wordStore.words.length > 0 && wordStore.words.map((word: ITypeWord, index: number) =>
            <WordItem word={word} index={index}/>)}
        </div>
    );
};

export default observer(WordDisplay);