import React, {FC, useState} from 'react';
import Letter from "./Letter";
import {values} from "mobx";
import {ITypeChar, ITypeWord} from "../store/WordStore";

type WordProps = {
    word: ITypeWord
    index: number
}


const WordItem: FC<WordProps> = ({word, index}: WordProps) => {

    return (
        <div className='ms-2.5'>
            {
                word.value.map((letter: ITypeChar, index: number) =>
               <Letter letter={letter} key={index}/>)
            }
        </div>
    );
};

export default WordItem;