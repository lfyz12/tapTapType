import React, {FC} from 'react';
import {observer} from "mobx-react-lite";
import {isCorrectStatus, ITypeChar} from "../store/WordStore";

type letterProps = {
    letter: ITypeChar
}


const Letter: FC<letterProps> = ({letter}: letterProps) => {

    return (
        <div className='relative inline-block font-normal font-sans text-xl'>
            <span className={
                letter.isCorrect === isCorrectStatus.correct
                    ? 'text-blue-500'
                    : letter.isCorrect === isCorrectStatus.incorrect
                        ? 'text-red-500'
                        : 'text-gray-100'}>
                {letter.value}
            </span>
            {letter.active && <div className="absolute bg-white w-2 h-0.5 transition-all duration-200 ease-in-out"
                                   style={{bottom: '-0.25rem', left: '50%', transform: 'translateX(-50%)'}}></div>}
        </div>
    );
};

export default observer(Letter);