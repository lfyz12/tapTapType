import React, {FC, useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";

type ResultScreenProps = {
    lang: boolean
    swapLang: () => void
}


const ResultScreen:FC<ResultScreenProps> = ({lang, swapLang}: ResultScreenProps) => {
    const {wordStore} = useContext(Context)

    const getRussianWords = async () => {
        await wordStore.getRussianWords(3)
    }
    const getEnglishWords = async () => {
        await wordStore.getEnglishWords(60)
    }

    const reset = async (newTime: number) => {
        wordStore.setTime(newTime)
        wordStore.reset();
        if (lang) {
            await getEnglishWords()
        } else {
            await getRussianWords()
        }
    };

    return (
        <div
            tabIndex={0}
            className='w-full h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4'
        >
            <div
                className='w-full max-w-4xl flex flex-wrap justify-center bg-gray-800 p-6 rounded-md shadow-lg space-y-6'>
                <h2 className="w-full text-3xl font-bold text-white text-center">Your Results</h2>

                <div className="w-full bg-gray-700 p-6 rounded-lg shadow-md space-y-4">
                    <div className="text-xl text-blue-400">
                        <span className="font-semibold">WPM: </span>{wordStore.wpm}
                    </div>
                    <div className="text-xl text-red-400">
                        <span className="font-semibold">Mistakes: </span>{wordStore.misstakes}
                    </div>
                    <div className="text-xl text-white">
                        <span className="font-semibold">Characters Typed: </span>{wordStore.isCorrectChars}
                    </div>
                    <div className="text-xl text-white">
                        <span className="font-semibold">Time: </span>{wordStore.time} seconds
                    </div>
                </div>
            </div>

            <button
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                onClick={() => reset(wordStore.time)}
            >
                Try Again
            </button>

        </div>

    );
};

export default observer(ResultScreen);