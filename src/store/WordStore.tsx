import {makeAutoObservable} from "mobx";
import WordApi from "../api/WordApi";

export interface ITypeWord {
    active: boolean
    value: ITypeChar[]
    currentIndex: number
    length: number
}

export interface ITypeChar {
    value: string
    active: boolean
    currentIndex: number
    isCorrect: isCorrectStatus
}

export const enum isCorrectStatus {
    'correct',
    'incorrect',
    'indefinite'
}

export class WordStore {
    words: ITypeWord[] = [] as ITypeWord[]

    currentWordIndex: number = 0
    currentCharIndex: number = 0
    misstakes: number = 0

    constructor() {
        makeAutoObservable(this)
    }

    setWords(words: ITypeWord[]) {
        this.words = words
        this.currentCharIndex = 0
        this.currentWordIndex = 0
    }

    get currentWord() : ITypeWord {
        return this.words[this.currentWordIndex]
    }

    get currentChar() : ITypeChar {
        return this.currentWord.value[this.currentCharIndex]
    }

    plusMisstakes() {
        this.misstakes++
    }


    sepToChars(word: string): ITypeChar[] {
        return word.split('').map((char: string, index: number) => {
            return {
                value: char,
                active: false,
                isCorrect: isCorrectStatus.indefinite,
                currentIndex: index}
        })
    }

    checkTypeChar(inputChar: string) {
        const currentChar = this.currentChar
        if (inputChar === this.currentChar.value) {
            currentChar.isCorrect = isCorrectStatus.correct
            this.getNextChar()
        } else {
            currentChar.isCorrect = isCorrectStatus.incorrect
            this.plusMisstakes()
        }

    }

    async getRussianWords(count: number) {
        try {
            const {data} = await WordApi.getRussianWords(count)
            const words: ITypeWord[] = data.text.split(' ').map((word: string, index: number) => {
                return {
                    active: false,
                    value: this.sepToChars(word),
                    currentIndex: index,
                    length: word.length
                }
            })
            this.setWords(words)
            return data.status
        } catch (error) {
            return error
        }
    }

    async getEnglishWords(count: number) {
        try {
            const {data} = await WordApi.getEnglishWords(count)
            const words: ITypeWord[] = data.body.map((word: string, index: number) => {
                return {
                    active: false,
                    value: this.sepToChars(word),
                    currentIndex: index,
                    length: word.length,
                }
            })

            this.setWords(words)

            return data.status
        } catch (error) {
            return error
        }
    }

    getNextWord() {
        if (this.currentWordIndex < this.words.length - 1) {
            this.currentWordIndex++
            this.currentCharIndex = 0
        }
    }

    getNextChar() {

        if (this.currentCharIndex < this.currentWord.length - 1) {
            this.currentChar.active = false
            this.currentCharIndex++;
            this.currentChar.active = true
        } else {
            this.getNextWord()
        }
    }



}