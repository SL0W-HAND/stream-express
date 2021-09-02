"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// This is not a real database,
// But let's imagine it is one :)
const data_1 = __importDefault(require("./data"));
// separe array in chunks of 10
function chunkArray(myArray, chunk_size) {
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];
    let pageNumber = 1;
    for (index = 0; index < arrayLength; index += chunk_size) {
        let myChunk = myArray.slice(index, index + chunk_size);
        // Do something if you want with the group
        let page = {
            page: pageNumber,
            total_pages: Math.ceil(arrayLength / chunk_size),
            videos: myChunk
        };
        pageNumber++;
        tempArray.push(page);
    }
    return tempArray;
}
class Database {
    constructor() { }
    //if you have a lot of data, dont use this
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const asArray = Object.values(data_1.default);
            return asArray;
        });
    }
    getPages() {
        return __awaiter(this, void 0, void 0, function* () {
            const pages = chunkArray(Object.values(data_1.default), 10);
            yield randomDelay();
            return pages;
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Object.prototype.hasOwnProperty.call(data_1.default, id)) {
                return null;
            }
            const entry = data_1.default[id];
            yield randomDelay();
            return entry;
        });
    }
    getByString(str) {
        return __awaiter(this, void 0, void 0, function* () {
            if (str.length === 0) {
                return null;
            }
            const asArray = Object.values(data_1.default);
            const results = asArray.filter((data) => {
                return data.name.toLowerCase().includes(str);
            });
            yield randomDelay();
            return results;
        });
    }
}
// Let's also add a delay to make it a bit closer to reality
const randomDelay = () => new Promise((resolve) => {
    const max = 350;
    const min = 100;
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    setTimeout(resolve, delay);
});
exports.default = Database;
