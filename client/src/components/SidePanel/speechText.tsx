import React, { useState, useEffect } from 'react';
import { cn } from '~/utils';
import { Mic, MicOff } from 'lucide-react';

// Add this type declaration at the top of the file
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  // Add necessary properties and methods
  continuous: boolean;
  interimResults: boolean;
  onresult: (event: SpeechRecognitionEvent) => void;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

const SpeechToText: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  let recognition: SpeechRecognition | null = null;

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);
      };
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      if (recognition) {
        recognition.stop();
      }
      setIsRecording(false);
    } else {
      if (recognition) {
        recognition.start();
      }
      setIsRecording(true);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        onClick={toggleRecording}
        className={cn(
          'flex items-center justify-center rounded-full p-2',
          isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600',
        )}
      >
        {isRecording ? <MicOff className="text-white" /> : <Mic className="text-white" />}
      </button>
      {transcript && (
        <div className="mt-2 rounded bg-gray-100 p-2 dark:bg-gray-700">
          <p className="text-sm">{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default SpeechToText;
