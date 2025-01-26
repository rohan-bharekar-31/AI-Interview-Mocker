"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


import { Button } from "@/components/ui/button"
import { LoaderCircle } from "lucide-react"
import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { chatSession } from "@/utils/GeminiAIModal"
import { db } from "@/utils/db"
import { MockInterview } from "@/utils/schema"
import { v4 as uuidv4 } from 'uuid';
import { useUser } from "@clerk/nextjs"
import moment from "moment/moment"
import { useRouter } from "next/navigation"

const AddNewInterview = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const [jobPosition, setJobPosition] = useState()
  const [jobDescription, setJobDescription] = useState()
  const [jobExperience, setJobExperience] = useState()
  const [loading,setLoading]=useState(false)
  const [JsonResponse,setJsonResponse]=useState()
  const {user}=useUser();
  const Router=useRouter();
  

  const handleSubmit=async(event)=>{
    setLoading(true);
    event.preventDefault();
    const InputPrompt="Job Position:"+jobPosition+", Job Description: "+jobDescription+", Job Experience:"+jobExperience+", Generate "+process.env.NEXT_PUBLIC_NUMBER_OF_QUESTIONS+" questions along with their answers in JSON format, ensuring that 3 of them are technical. The response should only include an array conatining question and answer in  json format";

    const result=await chatSession.sendMessage(InputPrompt);
    const MockJsonResp=(result.response.text()).replace('```json','').replace('```','')
    console.log(JSON.parse(MockJsonResp));
    setJsonResponse(MockJsonResp);
   
    if(MockJsonResp){
      const resp=await db.insert(MockInterview).values({
        mockId:uuidv4(),
        jsonMockResp:MockJsonResp,
        jobPosition:jobPosition,
        jobDesc:jobDescription,
        jobExperience:jobExperience,
        createdBy:user?.primaryEmailAddress?.emailAddress,
        createdAt:moment().format('DD-MM-yyyy'),
      }).returning({mockId:MockInterview.mockId});
      console.log("Inserted ID :",resp)

      if(resp){
        setOpenDialog(false);
        Router.push("/dashboard/interview/"+resp[0].mockId)
      }
    }
    else{
      console.log("Error")
    }

    setLoading(false);
  }

  return (
    <div>
      <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
        onClick={() => setOpenDialog(true)}>
        <h2 className=' text-lg text-center '  >+ Add New</h2>
      </div>

      <Dialog open={openDialog}>

        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Tell us more about your job interviewing</DialogTitle>
            <DialogDescription>
              <form onSubmit={handleSubmit}>

                <div>
                  <h2>Add details about your job position/role, Job description and years of experience</h2>

                  <div className="mt-7 my-3">
                    <label htmlFor="">Job Role/Job Position</label>
                    <Input required onChange={(event) => { setJobPosition(event.target.value) }} placeholder="Ex. Full Stack Developer" />
                  </div>

                  <div className=" my-3">
                    <label >Job Description/ Tech Stack {`{In Short}`} </label>
                    <Textarea required onChange={(event) => { setJobDescription(event.target.value) }} placeholder="Ex. React, Angular, Nodejs, MySql, etc" />
                  </div>

                  <div className=" my-3">
                    <label htmlFor="">Years of experience</label>
                    <Input required onChange={(event) => { setJobExperience(event.target.value) }} placeholder="Ex. 5" type="number" />
                  </div>

                </div>
                <div className="flex gap-5 justify-end">
                  <Button type="button" variant="ghost" onClick={() => { setOpenDialog(false) }}>Cancel</Button>
                  <Button type="submit" disabled={loading}> {loading?<><LoaderCircle className="animate-spin"/>Generating from AI</>:<>Start Interview</>}</Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default AddNewInterview