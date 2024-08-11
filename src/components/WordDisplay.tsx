import React, {FC, useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import WordItem from "./WordItem";
import {ITypeWord} from "../store/WordStore";

type WordDisplayProps = {
    lang: boolean;
    swapLang: () => void;
}

const WordDisplay: FC<WordDisplayProps> = ({ lang, swapLang }: WordDisplayProps) => {
    const { wordStore } = useContext(Context); // Доступ к стору через контекст

    const [time, setTime] = useState<number>(30);
    const [isTyping, setIsTyping] = useState<boolean>(false);

    const getRussianWords = async () => {
        await wordStore.getRussianWords(3);
    };
    const getEnglishWords = async () => {
        await wordStore.getEnglishWords(60);
    };

    // Таймер, который отсчитывает время
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

    // Обработчик событий клавиатуры
    const keyHandler = (e: React.KeyboardEvent) => {
        if (!isTyping && time > 0) {
            setIsTyping(true);
        }

        if (time <= 0) {
            wordStore.setIsEnd(true);
            wordStore.countWPM();
            setIsTyping(false);

            return;
        }

        const inputChar = e.key;
        const chraCode = e.code;

        if (e.key.length > 1 && e.key !== 'Backspace' && e.key !== ' ') {
            return; // Игнорируем любые клавиши, кроме символов, пробела и Backspace
        }

        // Обработка специальных клавиш
        switch (chraCode) {
            case 'Backspace':
                wordStore.goToBackChar(); // Возврат к предыдущему символу
                break;
            case 'Space':
                e.preventDefault();
                wordStore.getNextWord(); // Переход к следующему слову
                break;
            default:
                wordStore.checkTypeChar(inputChar); // Проверка введенного символа
        }
    };

    const reset = async (newTime: number) => {
        setTime(newTime); // Устанавливаем новое время
        wordStore.setTime(newTime); // Обновляем время в хранилище
        wordStore.reset(); // Сбрасываем состояние игры
        if (lang) {
            await getEnglishWords();
        } else {
            await getRussianWords();
        }
    };

    useEffect(() => {
        lang ? getEnglishWords() : getRussianWords();
    }, [lang]);

    return (
        <div onKeyDown={keyHandler} tabIndex={0}
             className='w-full h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center'>

            <div className="flex space-x-4 mb-4">
                <button className='bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-600' onClick={swapLang}>
                    {lang ? 'EN' : 'RU'}
                </button>
                <button className='bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-600' onClick={() => reset(30)}>
                    30 сек
                </button>
                <button className='bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-600' onClick={() => reset(60)}>
                    60 сек
                </button>
                <button className='bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-600' onClick={() => reset(120)}>
                    120 сек
                </button>
            </div>

            <div className='w-full max-w-4xl flex flex-wrap justify-center bg-gray-800 p-4 rounded-md'>
                {wordStore.words.length > 0 && wordStore.words.map((word: ITypeWord, index: number) =>
                    <WordItem word={word} key={index} index={index}/>)}
            </div>

            <div className="flex space-x-4 mt-4">
                <span className='text-red-500'>Ошибки: {wordStore.misstakes}</span>
                <span className='text-blue-400'>Время: {time} сек</span>
            </div>

        </div>
    );
};

export default observer(WordDisplay);