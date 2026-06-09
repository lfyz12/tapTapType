import React, {FC, useContext, useEffect, useRef} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";

type ResultScreenProps = {
    startGame: () => void;
    goToStart: () => void;
}

const ResultScreen:FC<ResultScreenProps> = ({startGame, goToStart}: ResultScreenProps) => {
    const {wordStore} = useContext(Context);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        containerRef.current?.focus();
    }, []);

    const keyHandler = (e: React.KeyboardEvent) => {
        if (e.key === 'Tab' || e.key === 'Enter' || e.key === 'Escape') {
            e.preventDefault();
            startGame();
        }
    };

    return (
        <div
            ref={containerRef}
            tabIndex={0}
            onKeyDown={keyHandler}
            className="min-h-screen bg-[#1e1e2e] text-gray-100 font-mono flex flex-col items-center justify-center outline-none select-none"
        >
            <div className="w-full max-w-md px-8">
                <div className="text-center mb-12">
                    <div className="text-7xl font-bold text-[#e2b714] mb-2">
                        {wordStore.wpm}
                    </div>
                    <div className="text-lg text-gray-500 tracking-widest uppercase">words per minute</div>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-12">
                    <div className="text-center">
                        <div className="text-2xl font-medium text-gray-100">{wordStore.rawWpm}</div>
                        <div className="text-xs text-gray-600 tracking-wider uppercase mt-1">raw</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-medium text-gray-100">{wordStore.accuracy}%</div>
                        <div className="text-xs text-gray-600 tracking-wider uppercase mt-1">accuracy</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-medium text-gray-100">{wordStore.mistakes}</div>
                        <div className="text-xs text-gray-600 tracking-wider uppercase mt-1">mistakes</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-medium text-gray-100">{wordStore.isCorrectChars}</div>
                        <div className="text-xs text-gray-600 tracking-wider uppercase mt-1">correct chars</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-medium text-gray-100">{wordStore.totalKeystrokes}</div>
                        <div className="text-xs text-gray-600 tracking-wider uppercase mt-1">keystrokes</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-medium text-gray-100">{wordStore.time}s</div>
                        <div className="text-xs text-gray-600 tracking-wider uppercase mt-1">time</div>
                    </div>
                </div>

                <div className="flex flex-col items-center space-y-4">
                    <button
                        onClick={startGame}
                        className="px-8 py-3 bg-transparent text-gray-400 hover:text-gray-200 transition-colors text-sm tracking-wider uppercase"
                    >
                        next test
                    </button>
                    <button
                        onClick={goToStart}
                        className="text-xs text-gray-600 hover:text-gray-400 transition-colors tracking-wider uppercase"
                    >
                        change settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default observer(ResultScreen);
