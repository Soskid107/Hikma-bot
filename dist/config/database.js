"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
// import other entities
exports.AppDataSource = new typeorm_1.DataSource({
// ...your config...
});
exports.default = exports.AppDataSource;
