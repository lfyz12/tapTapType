import {AxiosResponse} from "axios";
import {IEnglishWord, IRussianWord} from "../models/WordResponse/IWord";
import {$englishWords, $russianWords} from "./index";

export default class WordApi {
    static async getRussianWords(count: number): Promise<AxiosResponse<IRussianWord>> {
        return new Promise(resolve => resolve($russianWords.get(`/get?type=sentence&number=${count}&format=json`)))
    }

    static async getEnglishWords(count: number): Promise<AxiosResponse<IEnglishWord>> {
        return new Promise(resolve => resolve($englishWords.get(`/?count=${count}`)))
    }
}