import React, {FC} from 'react';
import Letter from "./Letter";
import {ITypeChar, ITypeWord} from "../store/WordStore";

type WordProps = {
    word: ITypeWord
    index: number
}

const WordItem: FC<WordProps> = ({word}: WordProps) => {
    return (
        <span className="inline">
            {word.value.map((letter: ITypeChar, index: number) =>
                <Letter letter={letter} key={index}/>)}
        </span>
    );
};

export default WordItem;
