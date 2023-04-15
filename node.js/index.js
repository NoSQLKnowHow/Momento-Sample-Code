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
var sdk_1 = require("@gomomento/sdk");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var momento, createCacheResponse, listResponse, setResponse, getResponse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    momento = new sdk_1.CacheClient({
                        configuration: sdk_1.Configurations.Laptop.v1(),
                        credentialProvider: sdk_1.CredentialProvider.fromEnvironmentVariable({
                            environmentVariableName: 'MOMENTO_AUTH_TOKEN',
                        }),
                        defaultTtlSeconds: 60,
                    });
                    return [4 /*yield*/, momento.createCache('cache')];
                case 1:
                    createCacheResponse = _a.sent();
                    if (createCacheResponse instanceof sdk_1.CreateCache.AlreadyExists) {
                        console.log('cache already exists');
                    }
                    else if (createCacheResponse instanceof sdk_1.CreateCache.Error) {
                        throw createCacheResponse.innerException();
                    }
                    /*
                    console.log('Getting a list of caches');
                    const listResponse = await momento.listCaches();
                    if (listResponse instanceof ListCaches.Success) {
                      console.log('Got the list successfully!');
                      listResponse.for
                    } else {
                      console.log(`Error setting key: ${setResponse.toString()}`);
                    } */
                    console.log('Listing caches:');
                    return [4 /*yield*/, momento.listCaches()];
                case 2:
                    listResponse = _a.sent();
                    if (listResponse instanceof sdk_1.ListCaches.Error) {
                        console.log("Error listing caches: ".concat(listResponse.message()));
                    }
                    else if (listResponse instanceof sdk_1.ListCaches.Success) {
                        console.log('Found caches:');
                        listResponse.getCaches().forEach(function (cacheInfo) {
                            console.log("".concat(cacheInfo.getName()));
                        });
                    }
                    else {
                        throw new Error("Unrecognized response: ".concat(listResponse.toString()));
                    }
                    console.log('Storing key=foo, value=FOO');
                    return [4 /*yield*/, momento.set('cache', 'foo', 'FOO')];
                case 3:
                    setResponse = _a.sent();
                    if (setResponse instanceof sdk_1.CacheSet.Success) {
                        console.log('Key stored successfully!');
                    }
                    else {
                        console.log("Error setting key: ".concat(setResponse.toString()));
                    }
                    return [4 /*yield*/, momento.get('cache', 'foo')];
                case 4:
                    getResponse = _a.sent();
                    if (getResponse instanceof sdk_1.CacheGet.Hit) {
                        console.log("cache hit: ".concat(getResponse.valueString()));
                    }
                    else if (getResponse instanceof sdk_1.CacheGet.Miss) {
                        console.log('cache miss');
                    }
                    else if (getResponse instanceof sdk_1.CacheGet.Error) {
                        console.log("Error: ".concat(getResponse.message()));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .then(function () {
    console.log('success!!');
})
    .catch(function (e) {
    console.error("Uncaught exception while running example: ".concat(e.message));
    throw Error;
});
