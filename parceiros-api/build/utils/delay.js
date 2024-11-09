"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const delay = (s) => {
    return new Promise(resolve => setTimeout(resolve, s * 1000));
};
exports.default = delay;
