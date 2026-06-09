import { makeAutoObservable } from "mobx";
import WordApi from "../api/WordApi";

export interface ITypeWord {
    value: ITypeChar[];
    currentIndex: number;
    length: number;
}

export interface ITypeChar {
    value: string;
    active: boolean;
    currentIndex: number;
    isCorrect: isCorrectStatus;
}

export const enum isCorrectStatus {
    'correct',
    'incorrect',
    'indefinite'
}

export class WordStore {
    words: ITypeWord[] = [];
    currentWordIndex: number = 0;
    currentCharIndex: number = 0;
    mistakes: number = 0;
    isCorrectChars: number = 0;
    totalKeystrokes: number = 0;
    time: number = 30;
    wpm: number = 0;
    rawWpm: number = 0;
    isEnd: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    get accuracy(): number {
        if (this.totalKeystrokes === 0) return 100;
        return Math.round((this.isCorrectChars / this.totalKeystrokes) * 100);
    }

    get currentWord(): ITypeWord {
        return this.words[this.currentWordIndex];
    }

    get currentChar(): ITypeChar {
        return this.currentWord.value[this.currentCharIndex];
    }

    setWords(words: ITypeWord[]) {
        this.words = words;
    }

    reset() {
        this.mistakes = 0;
        this.currentWordIndex = 0;
        this.currentCharIndex = 0;
        this.isCorrectChars = 0;
        this.totalKeystrokes = 0;
        this.wpm = 0;
        this.rawWpm = 0;
        this.setIsEnd(false);
    }

    plusMistakes() {
        this.mistakes++;
    }

    plusChar() {
        this.isCorrectChars++;
    }

    plusTotalKeystrokes() {
        this.totalKeystrokes++;
    }

    setIsEnd(bool: boolean) {
        this.isEnd = bool;
    }

    setTime(time: number) {
        this.time = time;
    }

    countWPM(elapsedSeconds: number) {
        const minutes = elapsedSeconds / 60;
        if (minutes <= 0) return;
        this.wpm = Math.round((this.isCorrectChars / 5) / minutes);
        this.rawWpm = Math.round((this.totalKeystrokes / 5) / minutes);
    }

    sepToChars(word: string, wordIndex: number): ITypeChar[] {
        return word.split('').map((char: string, index: number) => ({
            value: char,
            active: wordIndex === 0 && index === 0,
            isCorrect: isCorrectStatus.indefinite,
            currentIndex: index
        }));
    }

    goToBackChar() {
        const currentChar = this.currentChar;
        currentChar.isCorrect = isCorrectStatus.indefinite;
        this.getBackChar();
    }

    checkTypeChar(inputChar: string) {
        const currentChar = this.currentChar;
        this.plusTotalKeystrokes();

        if (inputChar === this.currentChar.value) {
            currentChar.isCorrect = isCorrectStatus.correct;
            this.plusChar();
            this.getNextChar();
        } else {
            currentChar.isCorrect = isCorrectStatus.incorrect;
            this.plusMistakes();
            this.getNextChar();
        }
    }

    async getRussianWords(count: number) {
        try {
            const { data } = await WordApi.getRussianWords(count);
            const words: ITypeWord[] = data.text.split(' ').map((word: string, index: number) => ({
                active: false,
                value: this.sepToChars(word, index),
                currentIndex: index,
                length: word.length
            }));
            this.setWords(words);
            return data.status;
        } catch (error) {
            return error;
        }
    }

    async getRussianWordsAsWords(count: number) {
        try {
            const { data } = await WordApi.getRussianWords(Math.ceil(count / 3));
            const allWords: string[] = data.text
                .split(/[\s,.!?;:()"—«»]+/)
                .filter((w: string) => w.length > 1 && /[а-яА-ЯёЁ]/.test(w));
            const shuffled = allWords.sort(() => Math.random() - 0.5).slice(0, count);
            const words: ITypeWord[] = shuffled.map((word: string, index: number) => ({
                active: false,
                value: this.sepToChars(word, index),
                currentIndex: index,
                length: word.length
            }));
            this.setWords(words);
            return data.status;
        } catch (error) {
            return error;
        }
    }

    async getEnglishWords(count: number) {
        try {
            const { data } = await WordApi.getEnglishWords(count);
            const words: ITypeWord[] = data.body.map((word: string, index: number) => ({
                active: false,
                value: this.sepToChars(word, index),
                currentIndex: index,
                length: word.length
            }));
            this.setWords(words);
            return data.status;
        } catch (error) {
            return error;
        }
    }

    getNextWord() {
        this.currentChar.active = false;
        if (this.currentWordIndex < this.words.length - 1) {
            this.currentWordIndex++;
            this.currentCharIndex = 0;
            this.currentChar.active = true;
        }
    }

    getNextChar() {
        if (this.currentCharIndex < this.currentWord.length - 1) {
            this.currentChar.active = false;
            this.currentCharIndex++;
            this.currentChar.active = true;
        }
    }

    getBackChar() {
        if (this.currentCharIndex <= this.currentWord.length - 1 && this.currentCharIndex !== 0) {
            this.currentChar.active = false;
            this.currentCharIndex--;
            this.currentChar.active = true;
        }
    }
}
