import { makeAutoObservable } from "mobx";
import WordApi from "../api/WordApi";
import { Simulate } from "react-dom/test-utils";
import reset = Simulate.reset;

// Интерфейс описывающий структуру слова в системе
export interface ITypeWord {
    value: ITypeChar[];
    currentIndex: number;
    length: number;
}

// Интерфейс описывающий структуру символа
export interface ITypeChar {
    value: string;
    active: boolean;
    currentIndex: number;
    isCorrect: isCorrectStatus;
}

// Перечисление возможных статусов символа (правильный, неправильный, неопределенный)
export const enum isCorrectStatus {
    'correct',
    'incorrect',
    'indefinite'
}

export class WordStore {
    words: ITypeWord[] = [] as ITypeWord[]; // Массив слов
    currentWordIndex: number = 0; // Индекс текущего слова
    currentCharIndex: number = 0; // Индекс текущего символа
    misstakes: number = 0; // Количество ошибок пользователя
    isCorrectChars: number = 0; // Количество правильно введенных символов
    time: number = 30; // Время, за которое пользователь должен напечатать слова (секунды)
    wpm: number = 0; // Скорость печати
    isEnd: boolean = false; // Индикатор об окончании времени

    constructor() {
        makeAutoObservable(this);
    }

    // Устанавливает слова в хранилище
    setWords(words: ITypeWord[]) {
        this.words = words;
    }

    // Сбрасывает текущее состояние хранилища
    reset() {
        this.misstakes = 0;
        this.currentWordIndex = 0;
        this.currentCharIndex = 0;
        this.isCorrectChars = 0;
        this.wpm = 0;
        this.setIsEnd(false);
    }

    // Геттер для получения текущего слова
    get currentWord(): ITypeWord {
        return this.words[this.currentWordIndex];
    }

    // Геттер для получения текущего символа
    get currentChar(): ITypeChar {
        return this.currentWord.value[this.currentCharIndex];
    }

    plusMisstakes() {
        this.misstakes++;
    }

    plusChar() {
        this.isCorrectChars++;
    }

    setIsEnd(bool: boolean) {
        this.isEnd = bool;
    }

    setTime(time: number) {
        this.time = time;
    }

    // Подсчитывает количество слов в минуту (WPM)
    countWPM() {
        const wordsTyped = this.isCorrectChars / 5;
        const minutes = this.time / 60;
        this.wpm = Math.round(wordsTyped / minutes);
    }

    // Преобразует слово в массив символов (ITypeChar)
    sepToChars(word: string, wordIndex: number): ITypeChar[] {
        return word.split('').map((char: string, index: number) => {
            return {
                value: char,
                active: wordIndex === 0 && index === 0 ? true : false,
                isCorrect: isCorrectStatus.indefinite,
                currentIndex: index
            };
        });
    }

    goToBackChar() {
        const currentChar = this.currentChar;
        currentChar.isCorrect = isCorrectStatus.indefinite; // Возвращаем статус символа к неопределенному
        this.getBackChar(); // Переход к предыдущему символу
    }

    // Проверяет правильность введенного символа
    checkTypeChar(inputChar: string) {
        const currentChar = this.currentChar;

        if (inputChar === this.currentChar.value) {
            currentChar.isCorrect = isCorrectStatus.correct;
            this.plusChar();
            this.getNextChar(); // Переход к следующему символу
        } else {
            currentChar.isCorrect = isCorrectStatus.incorrect;

            this.plusMisstakes();
            this.getNextChar(); // Переход к следующему символу
        }
    }

    // Получение списка русских слов
    async getRussianWords(count: number) {
        try {
            const { data } = await WordApi.getRussianWords(count);
            const words: ITypeWord[] = data.text.split(' ').map((word: string, index: number) => {
                return {
                    active: false,
                    value: this.sepToChars(word, index),
                    currentIndex: index,
                    length: word.length
                };
            });
            this.setWords(words);
            return data.status;
        } catch (error) {
            return error;
        }
    }

    // Получение списка английских слов
    async getEnglishWords(count: number) {
        try {
            const { data } = await WordApi.getEnglishWords(count);
            const words: ITypeWord[] = data.body.map((word: string, index: number) => {
                return {
                    active: false,
                    value: this.sepToChars(word, index),
                    currentIndex: index,
                    length: word.length
                };
            });

            this.setWords(words);

            return data.status;
        } catch (error) {
            return error;
        }
    }

    // Переход к следующему слову
    getNextWord() {
        this.currentChar.active = false;

        if (this.currentWordIndex < this.words.length - 1) {
            this.currentWordIndex++;
            this.currentCharIndex = 0;
            this.currentChar.active = true;
        }
    }

    // Переход к следующему символу
    getNextChar() {
        if (this.currentCharIndex < this.currentWord.length - 1) {
            this.currentChar.active = false;
            this.currentCharIndex++;
            this.currentChar.active = true;
        }
    }

    // Переход к предыдущему символу
    getBackChar() {
        if (this.currentCharIndex <= this.currentWord.length - 1 && this.currentCharIndex !== 0) {
            this.currentChar.active = false;
            this.currentCharIndex--;
            this.currentChar.active = true;
        }
    }
}