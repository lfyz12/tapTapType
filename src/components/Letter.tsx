import React, {FC} from 'react';
import {observer} from "mobx-react-lite";
import {isCorrectStatus, ITypeChar} from "../store/WordStore";

type letterProps = {
    letter: ITypeChar
}

const Letter: FC<letterProps> = ({letter}: letterProps) => {
    const charClass = letter.isCorrect === isCorrectStatus.correct
        ? 'text-gray-100'
        : letter.isCorrect === isCorrectStatus.incorrect
            ? 'text-red-400'
            : 'text-gray-600';

    const bgClass = letter.isCorrect === isCorrectStatus.incorrect
        ? 'bg-red-900/30 rounded-sm'
        : '';

    return (
        <span className={`relative inline-block font-mono text-2xl leading-relaxed ${charClass} ${bgClass}`}>
            {letter.value}
            {letter.active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2.5px] h-[1.2em] bg-[#e2b714] animate-caret" />
            )}
        </span>
    );
};

export default observer(Letter);
