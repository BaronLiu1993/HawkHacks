import React from 'react'


function Land() {
  return (
    <>
    <div className = 'space-x-6 flex justify-center items-center space-x-[10rem] h-[30rem]'>
    <div>
        <div className = 'text-6xl text-gray-400 font-bold'>
            EMO-Lens
        </div>  
        <div className = 'text-xl text-gray-400'>
            <div><br></br></div>
            Capturing all the emotions around you through a simple lens.
        </div>
        <div className = 'flex items-center space-x-5 mt-20'>
            <button className = 'border-4 p-4 rounded-[10rem]'>Get Started</button>
            <div className = 'w-[15rem]'>Don't miss out on our product :)</div>
        </div>
    </div>

    
        


    </div>

    <div className = 'bg-gray-300 h-[20rem] flex space-x-10 justify-center items-center'>
        <div className = 'w-[20rem]'>
            <div className = 'flex space-x-4'>
                <div className = 'bg-black w-[2rem] h-[2rem] rounded-[10rem]'></div>
                <div className = 'font-bold text-2xl'>
                    Recognition Feature
                </div>
            </div>
            
            <div className = 'font-semibold'>
                Able to understand greetings and comprehend messages
                </div>
        </div>
        <div className = 'w-[20rem]'>
            <div className = 'flex space-x-4'>
                <div className = 'bg-black w-[2rem] h-[2rem] rounded-[10rem]'></div>
                <div className = 'font-bold text-2xl'>
                    Transcribe Feature
                </div>
            </div>
            <div className = 'font-semibold'>
                    Uses the OpenAI Whisper Model to Transcribe and Even Translate Text

            </div>
        </div>
        <div className = 'w-[20rem]'>
            <div className = 'flex space-x-4'>
                <div className = 'bg-black w-[2rem] h-[2rem] rounded-[10rem]'></div>
                <div className = 'font-bold text-2xl'>
                    Analysis Feature
                </div>
            </div>
            <div className = 'font-semibold'>
                    Works to analyse and understand through using GPT 3.5 Turbo
            </div>
        </div>
    </div>
    </>
  )
}

export default Land