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
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = void 0;
const constants_1 = require("../constants");
const rest_1 = require("@octokit/rest");
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Ensure query string format.
        const { q } = req.query;
        if (!q) {
            res.status(400);
            res.send({
                data: null,
                errors: [constants_1.MSG_QUERY_ERROR_INSTRUCTIONS]
            });
            return;
        }
        // Configure a Github Octokit client.
        // Set dates on payload to (hopefully) see them in local timezone.
        const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const auth = process.env.PERSONAL_ACCESS_TOKEN || '';
        const octokit = new rest_1.Octokit({
            auth,
            timeZone: currentTimeZone
        });
        // Fetch users and their 5 last updated repos.
        // Limit items per page, as each resulting users leads to O(n) API calls for repos.
        // Add repos as a field of the result payload.
        const { data: users } = yield octokit.rest.search.users({
            q: q.toString(),
            per_page: 5
        });
        const repositories = [];
        if ((_a = users === null || users === void 0 ? void 0 : users.items) === null || _a === void 0 ? void 0 : _a.length) {
            for (let i = 0; i < users.items.length; i++) {
                const user = users.items[i];
                const { login: username } = user;
                const { data: repos } = yield octokit.rest.repos.listForUser({
                    username,
                    per_page: 5,
                    sort: 'updated'
                });
                repositories.push(repos);
            }
        }
        res.status(200).json({ data: { users: users || [], repositories } });
    }
    catch (err) {
        console.error(err);
        res.status(500);
        res.send({
            data: null,
            errors: ['oops!']
        });
    }
});
exports.search = search;
