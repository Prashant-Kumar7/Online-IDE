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
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const languageId = {
    "javascript": 63,
    "java": 62,
    "python": 71,
    "C++": 54
};
const app = (0, express_1.default)();
const port = 3000;
dotenv_1.default.config();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/api/exec", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, Language } = yield req.body;
    const langId = languageId[Language];
    if (langId) {
        const result = yield submitCode(code, langId);
        res.json({
            status: result === null || result === void 0 ? void 0 : result.status.description,
            Output: result === null || result === void 0 ? void 0 : result.stdout,
            error: result === null || result === void 0 ? void 0 : result.stderr,
            compilationError: result === null || result === void 0 ? void 0 : result.compile_output
        });
    }
    else {
        res.json("language not supported");
    }
}));
app.post("/api/testing", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = yield req.body;
    console.log(body);
    res.json(true);
}));
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
const submitCode = (code, languageId) => __awaiter(void 0, void 0, void 0, function* () {
    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions',
        params: { base64_encoded: 'false', wait: 'true' }, // Synchronous response
        headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            'X-RapidAPI-Key': process.env.X_RAPID_API_Key, // Replace with your key
        },
        data: {
            source_code: code, // Your code here
            language_id: languageId, // Language ID for JavaScript
        },
    };
    try {
        const response = yield axios_1.default.request(options);
        const result = response.data;
        console.log('Execution Status:', result.status.description);
        if (result.stdout) {
            console.log('Output:', result.stdout);
        }
        else if (result.stderr) {
            console.error('Error:', result.stderr);
        }
        else if (result.compile_output) {
            console.error('Compilation Error:', result.compile_output);
        }
        return response.data;
    }
    catch (error) {
        console.error('An error occurred:', error);
    }
});
// submitCode(`print("hello")\nprint("new line")` , languageId.python);
