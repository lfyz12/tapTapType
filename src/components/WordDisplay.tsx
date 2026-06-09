import React, {FC, useCallback, useContext, useEffect, useRef, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import WordItem from "./WordItem";
import {ITypeWord} from "../store/WordStore";

type WordDisplayProps = {
    lang: boolean;
    selectedTime: number;
    startGame: () => void;
}

const WordDisplay: FC<WordDisplayProps> = ({ lang, selectedTime, startGame }: WordDisplayProps) => {
    const { wordStore } = useContext(Context);
    const containerRef = useRef<HTMLDivElement>(null);

    const [time, setTime] = useState<number>(selectedTime);
    const [isTyping, setIsTyping] = useState<boolean>(false);

    const getRussianWords = useCallback(async () => {
        await wordStore.getRussianWords(3);
    }, [wordStore]);

    const getEnglishWords = useCallback(async () => {
        await wordStore.getEnglishWords(60);
    }, [wordStore]);

    useEffect(() => {
        lang ? getEnglishWords() : getRussianWords();
    }, [lang, getEnglishWords, getRussianWords]);

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (isTyping && time > 0) {
            timer = setInterval(() => {
                setTime(prevTime => prevTime - 1);
            }, 1000);
        }

        if (time <= 0) {
            setIsTyping(false);
            clearInterval(timer!);
        }

        return () => clearInterval(timer!);
    }, [isTyping, time]);

    useEffect(() => {
        containerRef.current?.focus();
    }, [wordStore.words]);

    const keyHandler = (e: React.KeyboardEvent) => {
        if (e.key === 'Tab' || e.key === 'Escape') {
            e.preventDefault();
            startGame();
            return;
        }

        if (!isTyping && time > 0) {
            setIsTyping(true);
        }

        if (time <= 0) {
            wordStore.countWPM(selectedTime);
            wordStore.setIsEnd(true);
            setIsTyping(false);
            return;
        }

        if (e.key.length > 1 && e.key !== 'Backspace' && e.key !== ' ') {
            return;
        }

        switch (e.code) {
            case 'Backspace':
                wordStore.goToBackChar();
                break;
            case 'Space':
                e.preventDefault();
                wordStore.getNextWord();
                break;
            default:
                wordStore.checkTypeChar(e.key);
        }
    };

    const liveWpm = isTyping && time < selectedTime
        ? Math.round((wordStore.isCorrectChars / 5) / ((selectedTime - time) / 60))
        : 0;

    return (
        <div
            ref={containerRef}
            onKeyDown={keyHandler}
            tabIndex={0}
            className="min-h-screen bg-[#1e1e2e] text-gray-100 font-mono flex flex-col outline-none select-none"
        >
            <div className="flex-1 flex items-start justify-center px-8 pt-24">
                <div className="max-w-4xl w-full text-2xl leading-relaxed" style={{ lineHeight: '2.2rem' }}>
                    {wordStore.words.length > 0 && wordStore.words.map((word: ITypeWord, index: number) => (
                        <React.Fragment key={index}>
                            <WordItem word={word} index={index} />
                            {index < wordStore.words.length - 1 && (
                                <span className="text-gray-600"> </span>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-center space-x-8 py-8 text-lg">
                <span className="text-[#e2b714] min-w-[80px] text-center">
                    {isTyping || time < selectedTime ? liveWpm : 0} wpm
                </span>
                <span className="text-gray-500 min-w-[60px] text-center">
                    {wordStore.accuracy}%
                </span>
                <span className="text-gray-500 min-w-[50px] text-center">
                    {time}s
                </span>
            </div>
        </div>
    );
};

export default observer(WordDisplay);
