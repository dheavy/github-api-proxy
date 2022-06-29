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
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("../server");
const constants_1 = require("../constants");
const rest_1 = require("@octokit/rest");
jest.mock('@octokit/rest');
rest_1.Octokit.mockImplementation(() => {
    return {
        rest: {
            search: {
                users: () => ({
                    data: {
                        items: [{ foo: 'bar' }, { foo: 'baz' }]
                    }
                })
            },
            repos: {
                listForUser: () => ({
                    data: [
                        [{ foo: 'bar' }, { foo: 'baz' }]
                    ]
                })
            }
        }
    };
});
let server;
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    server = yield (0, server_1.createServer)();
}));
describe('GET /', () => {
    it('should return 404 status with usage instructions in error message', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server).get('/');
        expect(response.statusCode).toBe(404);
        expect(response.body).toMatchObject({
            data: null,
            errors: [constants_1.MSG_404_ERROR_INSTRUCTIONS]
        });
    }));
});
describe('GET /search', () => {
    it('should return 400 and instructions if querystring is missing or malformed', () => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield (0, supertest_1.default)(server).get('/search');
        expect(response.statusCode).toBe(400);
        expect(response.body).toMatchObject({
            data: null,
            errors: [constants_1.MSG_QUERY_ERROR_INSTRUCTIONS]
        });
        response = yield (0, supertest_1.default)(server).get('/search?q=');
        expect(response.statusCode).toBe(400);
        expect(response.body).toMatchObject({
            data: null,
            errors: [constants_1.MSG_QUERY_ERROR_INSTRUCTIONS]
        });
        response = yield (0, supertest_1.default)(server).get('/search?foo=bar');
        expect(response.statusCode).toBe(400);
        expect(response.body).toMatchObject({
            data: null,
            errors: [constants_1.MSG_QUERY_ERROR_INSTRUCTIONS]
        });
    }));
    it('should return 200 when Github API successfully returns data', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server).get('/search?q=dheavy');
        expect(response.statusCode).toBe(200);
    }));
    it('should return a payload of shape { data: { users: { ..., items: Array }, repositories: Array<Array> } }', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server).get('/search?q=dheavy');
        expect(response.body).toBeTruthy();
        const body = response.body;
        expect(body.data).toBeTruthy();
        expect(body.data.users).toBeTruthy();
        expect(body.data.users.items).toBeTruthy();
        expect(Array.isArray(body.data.users.items)).toBe(true);
        expect(body.data.repositories).toBeTruthy();
        expect(Array.isArray(body.data.repositories[0])).toBe(true);
    }));
});
