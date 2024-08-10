
export type IWord = IRussianWord | IEnglishWord

export interface IRussianWord {
    status: string
    text: string
}

export interface IEnglishWord {
    body: string[]
    status: number
}

