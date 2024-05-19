import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';

const Memory = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedVideos, setRecordedVideos] = useState([]);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(null);

  const startCapture = () => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: 'video/webm'
    });

    mediaRecorderRef.current.ondataavailable = handleDataAvailable;
    mediaRecorderRef.current.start();
  };

  const stopCapture = () => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  };

  const handleDataAvailable = ({ data }) => {
    if (data.size > 0) {
      setRecordedVideos(prev => [...prev, data]);
    }
  };

  const handleDownload = (index) => {
    const blob = recordedVideos[index];
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `video_${index + 1}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    setSelectedVideoIndex(null);
  };

  const renderVideoPreviews = () => {
    return recordedVideos.map((video, index) => (
      <div key={index} className="video-preview">
        <video className = 'h-[20rem] w-[20rem] rounded-xl m-5' controls>
          <source src={URL.createObjectURL(video)} type="video/webm" />
          Your browser does not support the video tag.
        </video>
        <button className="text-black font-bold px-4 py-2 rounded-xl w-[10rem] border-2 bg-gray-400" onClick={() => handleDownload(index)}>Download Video {index + 1}</button>
      </div>
    ));
  };

  return (
    <div className="bg-black h-[70rem] flex flex-col items-center justify-center text-white">
      {!selectedVideoIndex && (
        <div className="flex items-center justify-center space-x-10">
          <div className="flex flex-col items-center">
            <Webcam className="rounded-lg border-4" audio={false} ref={webcamRef} />
            <div className="mt-5 text-white">
              {capturing ? (
                <button className="text-black font-bold px-4 py-2 rounded-full border-2 bg-gray-400" onClick={stopCapture}>Stop Recording</button>
              ) : (
                <button className="text-black font-bold px-4 py-2 rounded-full border-2 bg-gray-400" onClick={startCapture}>Start Recording</button>
              )}
            </div>
          </div>
          <div className="text-white">
            <div className="font-bold text-2xl mb-5">Record and Download Videos</div>
            <ul className="text-sm text-white mb-5">
              <li>Revisit all the memories you've saved!</li>
              <br></br>
              <li>Press start record to begin, memory of all your favourite videos </li>
              <li>are stored to be flexibility accessed by you in our library.</li>
            </ul>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-5 mt-5">
        {recordedVideos.length > 0 && renderVideoPreviews()}
      </div>

      {selectedVideoIndex !== null && (
        <div className="text-white flex ">
          <video controls className="h-[10rem] w-[10rem]">
            <source src={URL.createObjectURL(recordedVideos[selectedVideoIndex])} type="video/webm" />
            Your browser does not support the video tag.
          </video>
          <div>
            <button className="text-black font-bold px-4 py-2 rounded-full border-2 bg-gray-400" onClick={handleReset}>Back to Videos</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Memory;

