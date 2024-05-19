import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const APIKEY = 'APIKEY_HERE';
const triggerWords = ['hello.', 'hi.'];
const RECORDING_DURATION = 10000;

const App = () => {
  const [text, setText] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const mediaRecorderRef = useRef(null);
  const recognitionRef = useRef(null);
  const recognitionActiveRef = useRef(false);

  useEffect(() => {
    if (!recognitionRef.current && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onresult = async (event) => {
        const greeting = event.results[0][0].transcript.toLowerCase().trim();
        console.log('Recognition result:', greeting);

        if (triggerWords.includes(greeting)) {
          setTranscription(`Recognition result: ${greeting}`);
          await startRecording();
        } else {
          setTranscription(`Greeting "${greeting}" not recognized.`);
        }
      };

      recognitionRef.current.onend = () => {
        recognitionActiveRef.current = false;
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Recognition error:', event.error);
        setTranscription(`Recognition error: ${event.error}`);
      };
    }
  }, []);

  const handleRecognition = () => {
    if (recognitionRef.current && !recognitionActiveRef.current) {
      recognitionRef.current.start();
      recognitionActiveRef.current = true;
      setTranscription('Listening for greetings...');
    } else {
      setTranscription('Speech recognition is not supported in this browser.');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      const audioChunks = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);

        await transcribeAudio(audioBlob);
      };

      mediaRecorderRef.current.start();
      setLoading(true);

      setTimeout(() => {
        if (mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          setLoading(false);
        }
      }, RECORDING_DURATION);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError('Error accessing microphone');
      setLoading(false);
    }
  };

  const transcribeAudio = async (audioBlob) => {
    setLoading(true);
    setError(null);
    setTranscription('');

    const formData = new FormData();
    formData.append('file', audioBlob);
    formData.append('model', 'whisper-1');

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/audio/transcriptions',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${APIKEY}`,
          },
        }
      );

      const transcribedText = response.data.text;
      console.log('Transcription:', transcribedText);
      setTranscription(`Transcription: ${transcribedText}`);

      await analyse(transcribedText);

    } catch (error) {
      console.error('Error transcribing audio:', error);
      setError('Error transcribing audio');
    } finally {
      setLoading(false);
    }
  };

  const analyse = async (transcribedText) => {
    console.log('Analyzing:', transcribedText);

    const APIBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        {
          "role": "system",
          "content": "You will be provided with a piece of text, and your task is to classify its sentiment as positive, neutral, or negative and give a score to it from 0 to 1" + transcribedText
        },
        {
          "role": "user",
          "content": "Tell me what they are trying to say and interpret"
        }
      ],
      "temperature": 0.7,
      "max_tokens": 60,
      "top_p": 1
    };

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + APIKEY
        },
        body: JSON.stringify(APIBody)
      });
      const data = await response.json();
      console.log('Analysis:', data);
      const analysisResult = data.choices[0].message.content.trim();
      setSentiment(`Sentiment: ${analysisResult}`);

    } catch (error) {
      console.error('Error in analysis:', error);
      setError('Error in analysis');
    }
  };

  return (
    <div>
      <div className = 'h-[70rem] flex flex-col justify-center items-center'>
          <div className = 'text-4xl font-bold'>Emotion Detection</div>
          <div className = 'mb-10'> based on your speech patterns</div>
          <div className = 'flex justify-center items-center space-x-5'>
          <div className = 'rounded-xl border-gray-300 border-4 p-5 h-[30rem] w-[25rem] flex flex-col justify-between shadow-2xl'>
            <div>
              <div className = 'font-semibold text-xl'>Gesture Recognition</div>
              <button className="text-black font-bold px-4 py-2 rounded-full border-2 bg-gray-400 mt-10" onClick={handleRecognition} disabled={loading}>
                {recognitionActiveRef.current ? 'Listening...' : 'Start Recognition'}
              </button>
              <div>
                {loading && <p>Recording...</p>}
                {error && <p>Error: {error}</p>}
              </div>
            </div>
            <div className = 'font-semibold'>Web Speech API for Gesture/Word Recognition</div>
          </div>

          <div className = 'rounded-xl border-gray-300 border-4 p-5 h-[30rem] w-[25rem] flex flex-col justify-between shadow-2xl'>
            <div>
              <div className = 'font-semibold text-xl'>Transcription + Translation</div>
              <p className = 'mt-5'>{transcription}</p>
              <p className = 'mt-5'>{audioURL && <audio controls src={audioURL} />}</p>
            </div>
            <div className = 'font-semibold'>Transcribed with OpenAI Whisper Model, built for Various Language Including Mandarin and French</div>
          </div>

          <div className = 'rounded-xl border-gray-300 border-4 p-5 h-[30rem] w-[25rem] flex flex-col justify-between shadow-2xl'>
            <div>
            <div className = 'font-semibold text-xl'>Analysis and Prompt</div>
            <p className = 'mt-5'>{sentiment}</p>
            </div>
            <div className = 'font-semibold'>Analysed Emotions using Prompt Engineered GPT-3.5 Turbo Model</div>
          </div>
          </div>
      </div>

    </div>
  );
};

export default App;
