"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomWisdomQuote = getRandomWisdomQuote;
const node_fetch_1 = __importDefault(require("node-fetch"));
async function getRandomWisdomQuote() {
    try {
        const response = await (0, node_fetch_1.default)('https://api.quotable.io/random');
        if (!response.ok) {
            return 'Could not fetch a wisdom quote at this time. Please try again later.';
        }
        // Explicitly type the data
        const data = await response.json();
        return `"${data.content}" — ${data.author}`;
    }
    catch (error) {
        return 'Could not fetch a wisdom quote at this time. Please try again later.';
    }
}
