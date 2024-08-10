import React, {FC} from 'react';
import {observer} from "mobx-react-lite";
import {isCorrectStatus, ITypeChar} from "../store/WordStore";

type letterProps = {
    letter: ITypeChar
}


const Letter: FC<letterProps> = ({letter}: letterProps) => {

    return (
        <div
            className={`inline ${
                letter.isCorrect === isCorrectStatus.correct 
                ? 'text-green-500' : letter.isCorrect === isCorrectStatus.incorrect 
                ? 'text-red-500' : ''} ${letter.active ? 'underline' : 'no-underline'} `}>
            {letter.value}
        </div>
    );
};

export default observer(Letter);