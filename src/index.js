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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBulletins = exports.app = void 0;
var express_1 = require("express");
var axios_1 = require("axios");
var fs = require("fs");
exports.app = (0, express_1.default)();
var port = process.env.PORT || 3000;
var fetchUsers = function () { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios_1.default.get('https://jsonplaceholder.typicode.com/users')];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); };
var fetchPhotos = function () { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios_1.default.get('https://jsonplaceholder.typicode.com/photos')];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); };
var fetchPosts = function () { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios_1.default.get('https://jsonplaceholder.typicode.com/posts')];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); };
var createBulletins = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, usersData, photosData, postsData, usersMap, bulletins;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, Promise.all([
                    fetchUsers(),
                    fetchPhotos(),
                    fetchPosts(),
                ])];
            case 1:
                _a = _b.sent(), usersData = _a[0], photosData = _a[1], postsData = _a[2];
                usersMap = new Map();
                usersData.forEach(function (user) { return usersMap.set(user.id, user); });
                bulletins = [];
                postsData.forEach(function (post) {
                    var user = usersMap.get(post.userId);
                    var photo = photosData.find(function (p) { return p.id === post.id; });
                    if (user && photo) {
                        var bulletin = {
                            id: post.id,
                            title: post.title,
                            body: post.body,
                            username: user.username,
                            geo: user.address.geo,
                            imageUrl: photo.url,
                        };
                        bulletins.push(bulletin);
                    }
                });
                return [2 /*return*/, bulletins];
        }
    });
}); };
exports.createBulletins = createBulletins;
exports.app.get('/getBulletin', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var bulletins, consolidatedData, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, exports.createBulletins)()];
            case 1:
                bulletins = _a.sent();
                consolidatedData = {
                    bulletins: bulletins,
                };
                fs.writeFileSync('consolidatedData.json', JSON.stringify(consolidatedData, null, 2));
                res.json(consolidatedData);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error("Error consolidating data: ".concat(error_1));
                res.status(500).json({ error: 'Internal Server Error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.app.listen(port, function () {
    console.log("Server is running on port ".concat(port));
});
