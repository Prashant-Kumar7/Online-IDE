import axios, { AxiosResponse } from 'axios';
import express , {Request , response, Response} from "express"
import cors from "cors"
import dotenv from "dotenv";


interface SubmissionResponse {
  token: string;
  status: { id: number; description: string };
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  message?: string;
}

interface languageIdType {
    [key : string] : number
}

const languageId : languageIdType = {
    "javascript" : 63,
    "java" : 62,
    "python" : 71,
    "C++" : 54
}

const app = express()
const port = 3000


dotenv.config();
app.use(cors())
app.use(express.json())


app.post("/api/exec" , async(req: Request , res : Response)=>{
    const {code , Language} = await req.body
    const langId = languageId[Language]
    if(langId){
        const result = await submitCode(code , langId)
        res.json({
            status : result?.status.description,
            Output : result?.stdout,
            error : result?.stderr,
            compilationError : result?.compile_output
        })
    } else {
        res.json("language not supported")
    }
})

app.post("/api/testing" , async(req : Request , res : Response)=>{
    const body = await req.body
    console.log(body)
    res.json(true)
})


app.listen(port , ()=>{
    console.log(`server is running on port ${port}`)
})

const submitCode = async (code : string , languageId : number) => {
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
    const response: AxiosResponse<SubmissionResponse> = await axios.request(options);
    const result = response.data;

    console.log('Execution Status:', result.status.description);
    if (result.stdout) {
      console.log('Output:', result.stdout);
    } else if (result.stderr) {
      console.error('Error:', result.stderr);
    } else if (result.compile_output) {
      console.error('Compilation Error:', result.compile_output);
    }
    return response.data
  } catch (error) {
    console.error('An error occurred:', error);
  }
  
};
