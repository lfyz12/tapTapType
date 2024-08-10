import axios from "axios";

const $englishWords = axios.create({
    baseURL: 'https://word-generator2.p.rapidapi.com'
})

const $russianWords = axios.create({
    baseURL: 'https://fish-text.ru'
})

$englishWords.interceptors.request.use(config => {
    config.headers['x-rapidapi-key'] = '02621a7a24mshcc209911fcb938dp1feafcjsnc726052d32d9'
    config.headers['x-rapidapi-host'] = 'word-generator2.p.rapidapi.com'
    return config
}, error => Promise.reject(error))

export {
    $englishWords,
    $russianWords
}