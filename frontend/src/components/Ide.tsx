'use client'

import React, { useState } from 'react'
// import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// import Editor from '@monaco-editor/react';
import MonacoEditor from 'react-monaco-editor';
import axios from 'axios'

const languageOptions = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  // { value: 'csharp', label: 'C#' },
  { value: `C++`, label: 'C++' },
]

interface initialCodeType {
    [key : string] : string
}



const initialCode : initialCodeType = {
  javascript: 'console.log("Hello from JavaScript!");',
  python: 'print("Hello from Python!")',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java!");\n    }\n}',
  csharp: 'using System;\n\nclass Program {\n    static void Main(string[] args) {\n        Console.WriteLine("Hello from C#!");\n    }\n}',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello from C++!" << std::endl;\n    return 0;\n}',
}

export function MultiLanguageIDE() {
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState<string | undefined>(initialCode[language])
  const [output, setOutput] = useState('')

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    setCode(initialCode[value])
    setOutput('')
  }

  const handleEditorChange = (value: string | undefined) => {
    setCode(value)
    console.log(value)
  }

  const handleRun = async()=>{
    axios.post("http://localhost:3000/api/exec" , {code : code , Language : language}).then((res)=>{
        console.log(res.data)
        setOutput(res.data.Output)
    })
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Multi-Language IDE</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="h-[400px] border rounded-md overflow-hidden">
            <MonacoEditor
              language={language}
              theme="vs-dark"
              value={code}
              options={{
                minimap: { enabled: false },
                automaticLayout: true,
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
              }}
              onChange={handleEditorChange}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          <Button onClick={handleRun}>Run Code</Button>
          <div className="w-full bg-gray-100 p-4 rounded-md min-h-[60px]" aria-live="polite">
            <h3 className="text-lg font-semibold mb-2">Output:</h3>
            <pre className="whitespace-pre-wrap">{output}</pre>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}