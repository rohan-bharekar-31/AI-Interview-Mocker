"use client"
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import React, { useEffect, useState } from 'react'
import { eq } from 'drizzle-orm'
import { Lightbulb, WebcamIcon } from 'lucide-react'
import Webcam from 'react-webcam'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'

const Interview = ({ params }) => {
    const [interviewData, setInterviewData] = useState({});
    const [webCamEnabled, setWebCamEnabled] = useState(false);
    const { interviewId } = useParams()

    useEffect(() => {
        GetInterviewDetails()
    }, [])


    const GetInterviewDetails = async () => {

        const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, interviewId));
        setInterviewData(result[0]);
    }
    return (

        <div className='my-10 '>
            <h2 className='font-bold text-2xl'>Let's Get Started</h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-10 '>

                <div className='flex flex-col p-5 my-5 gap-5  '>
                    <div className='flex flex-col p-5 rounded-lg border gap-5'>
                        <h2 className='text-lg'><strong>Job Role/Job Position: </strong>{interviewData.jobPosition}</h2>
                        <h2 className='text-lg'><strong>Job Description/Tech Stack: </strong>{interviewData.jobDesc}</h2>
                        <h2 className='text-lg'><strong>Years of Experience: </strong>{interviewData.jobExperience}</h2>
                    </div>

                    <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
                        <h2 className='flex gap-2 items-center text-yellow-700'><Lightbulb /> <strong>Information</strong></h2>
                        <h2 className='mt-3 text-yellow-700'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
                    </div>
                </div>

                <div>
                    {
                        webCamEnabled ? <Webcam
                            onUserMedia={() => setWebCamEnabled(true)}
                            onUserMediaError={() => setWebCamEnabled(false)}
                            style={{
                                height: 300,
                                width: 300

                            }}
                        /> : <><WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary rounded-lg border' />
                            <Button variant='ghost' className='w-full' onClick={() => { setWebCamEnabled(true) }} >Enable Web Cam and MicroPhone</Button>
                        </>
                    }
                </div>
            </div>
            <div className='flex justify-end items-end'>
                <Button>Start Interview</Button>
            </div>

        </div>
    )
}

export default Interview