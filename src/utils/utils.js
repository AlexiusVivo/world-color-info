const { parse } = require('node-html-parser');
const {
    CATEGORIES, SCRAPPER_KEYS, CONTINENTS_NAMING,
} = require('../variables/variables');
const { getColors } = require('../colors/colors')

const startTbIndex = 2;
const endTbIndex = 10;

const dataSelector = (continent) => `#main_table_countries_today tr[data-continent="${continent}"] td`;

const categories = Object.values(CATEGORIES);

const mapStringToNumber = (numString = '') => Number(numString.split(',').join(''));

const selectFields = (table) => Array.from(table)
    .map((item) => item.childNodes)
    .slice(startTbIndex, endTbIndex)
    .map((node) => {
        const nodeChild = node[0];
        return mapStringToNumber(nodeChild ? nodeChild.rawText : '0');
    });

const getColorValues = (info) => {
    for (category in info) {
        try {
            const currCategoryValues = info[category]['values']
            if (currCategoryValues === {}) {
                throw new Error('Categorys value is empty')
            }
            const colorValues = getColors(currCategoryValues, category)
            info[category]['colors'] = colorValues
        } catch (e) {
            console.error(e.message);
        }
    }
    return info
}
    
const parseCoronaInfoData = (htmlPage) => {
    const root = parse(htmlPage.data);

    let assembleInfo = {};

    SCRAPPER_KEYS.forEach((scrapperKey) => {
        const categoriesTextNodes = root.querySelectorAll(dataSelector(scrapperKey));

        const fieldValues = selectFields(categoriesTextNodes);
        
        categories.forEach((category, index) => {
            assembleInfo = {
                ...assembleInfo,
                [category]: {
                    values: {
                        ...(assembleInfo[category]?.values || {}),
                        [CONTINENTS_NAMING[scrapperKey]]: fieldValues[index],
                    },
                    colors: {
                        ...(assembleInfo[category]?.colors || {}),
                        [CONTINENTS_NAMING[scrapperKey]]: '',
                    }
                },
            };
        });
    });
    return assembleInfo;
};



const formatError = (e) => ({ message: e.message });

const createHandler = (db, fn) => (req, res) => fn({ db, req, res });

module.exports = {
    parseCoronaInfoData,
    formatError,
    createHandler,
    getColorValues
};
