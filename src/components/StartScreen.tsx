import React, {FC, useEffect, useRef} from 'react';

type StartScreenProps = {
    lang: boolean;
    swapLang: (newLang?: boolean) => void;
    mode: 'words' | 'sentences';
    setMode: (mode: 'words' | 'sentences') => void;
    selectedTime: number;
    setSelectedTime: (time: number) => void;
    startGame: () => void;
}

const StartScreen: FC<StartScreenProps> = ({ lang, swapLang, mode, setMode, selectedTime, setSelectedTime, startGame }) => {
    const startedRef = useRef(false);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (startedRef.current) return;
            startedRef.current = true;
            startGame();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [startGame]);

    return (
        <div className="min-h-screen bg-[#1e1e2e] text-gray-100 font-mono flex flex-col items-center justify-center select-none">
            <div className="text-5xl font-bold text-[#e2b714] mb-16 tracking-wide">
                tapTapType
            </div>

            <div className="flex flex-col items-center space-y-8">
                <div className="flex items-center space-x-6">
                    <button
                        onClick={() => swapLang(true)}
                        className={`text-lg transition-colors focus:outline-none ${lang ? 'text-[#e2b714]' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        english
                    </button>
                    <span className="text-gray-600">/</span>
                    <button
                        onClick={() => swapLang(false)}
                        className={`text-lg transition-colors focus:outline-none ${!lang ? 'text-[#e2b714]' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        russian
                    </button>
                </div>

                <div className="flex items-center space-x-5">
                    {[15, 30, 60, 120].map(t => (
                        <button
                            key={t}
                            onClick={() => setSelectedTime(t)}
                            className={`text-lg transition-colors focus:outline-none ${selectedTime === t ? 'text-[#e2b714]' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {!lang && (
                    <div className="flex items-center space-x-6">
                        <button
                            onClick={() => setMode('words')}
                            className={`text-lg transition-colors focus:outline-none ${mode === 'words' ? 'text-[#e2b714]' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            words
                        </button>
                        <span className="text-gray-600">/</span>
                        <button
                            onClick={() => setMode('sentences')}
                            className={`text-lg transition-colors focus:outline-none ${mode === 'sentences' ? 'text-[#e2b714]' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            sentences
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-20 text-gray-600 text-sm">
                press any key to start
            </div>
        </div>
    );
};

export default StartScreen;
