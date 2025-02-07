"use client"
import Webcam from 'react-webcam'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle } from 'lucide-react';
import { toast } from 'react-toastify'
import { chatSession } from '@/utils/GeminiAIModal'
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'

const RecordAnswerSection = ({ mockInterviewQuestion, activeQuestionIndex, interviewData }) => {
    const [userAnswer, setUserAnswer] = useState('')
    const { user } = useUser();
    const [loading, setLoading] = useState(false)

    const {
        error,
        interimResult,
        isRecording,
        results,
        setResults,
        startSpeechToText,
        stopSpeechToText,
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });

    useEffect(() => {

        results.map((result) => (
            setUserAnswer(prevAns => prevAns + result?.transcript)
        ))
    }, [results])

    useEffect(() => {
      if(userAnswer.length>10 && !isRecording){
        UpdateUserAnswer();
      }
      if(userAnswer.length<10 && !isRecording){
        setResults([])
        setUserAnswer("")
      }
    }, [userAnswer])
    

    const StartStopRecording =  () => {
        if (isRecording) {
            stopSpeechToText();
        }
        else {
            startSpeechToText()
        }
    }

    const UpdateUserAnswer = async () => {

        console.log(userAnswer);
        setLoading(true)
        const feedbackPrompt = "Question:" + mockInterviewQuestion[activeQuestionIndex]?.question + ", User Answer:" + userAnswer + ",Depends on question and user answer please give us rating and feedback as area of improvement if any in just 3 to 5 lines to improve it in JSON format with rating and feedback field ";
        const result = await chatSession.sendMessage(feedbackPrompt);
        const mockJsonResp = (result.response.text()).replace('```json', '').replace('```', '')
        console.log(mockJsonResp)
        const JsonFeedbackResp = JSON.parse(mockJsonResp)

        const resp = await db.insert(UserAnswer).values(
            {
                mockIdRef: interviewData?.mockId,
                question: mockInterviewQuestion[activeQuestionIndex]?.question,
                correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
                userAns: userAnswer,
                feedback: JsonFeedbackResp?.feedback,
                rating: JsonFeedbackResp?.rating,
                userEmail: user?.primaryEmailAddress.emailAddress,
                createdAt: moment().format("DD-MM-YYYY")
            }
        )

        if (resp) {
            toast.success("User Answer recorded successfully")
            setUserAnswer("");
        }
        setResults([]);
        setLoading(false);
    }

    return (
        <div className='flex flex-col items-center'>
            <div className='flex flex-col justify-center my-20 items-center bg-black rounded-lg p-5'>
                <Image src={'/webcam.png'} width={200} height={200} className='absolute' />
                <Webcam

                    style={{
                        width: '100%',
                        height: 300,
                        zIndex: 10,
                    }}
                />
            </div>

            <Button variant="outline" disabled={loading} className="my-10" onClick={StartStopRecording}>{isRecording ? <h2 className='text-red-600 flex gap-2'><StopCircle /> Stop Recording</h2> : <h2 className=' flex gap-2'><Mic /> Record Answer</h2>}</Button>
            
        </div>
    )
}

export default RecordAnswerSection