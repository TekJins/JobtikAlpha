import React, { useState, useEffect, useRef } from 'react';
import { useSubmitMessage } from '~/hooks';

const SpeechToText = ({ setQuery }) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(true);
  const [savedTranscripts, setSavedTranscripts] = useState([]);
  const { submitPrompt } = useSubmitMessage();
  const transcriptDivRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcriptResult = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');
      setTranscript(transcriptResult);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      if (event.error === 'no-speech' || event.error === 'aborted') {
        console.log('reload');
      }
    };

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening]);

  useEffect(() => {
    const storedTranscripts = JSON.parse(localStorage.getItem('savedTranscripts') || '[]');
    setSavedTranscripts(storedTranscripts);
  }, []);

  useEffect(() => {
    if (transcriptDivRef.current) {
      transcriptDivRef.current.scrollTop = transcriptDivRef.current.scrollHeight;
    }
  }, [transcript]);

  const refreshSpeechToText = () => {
    if (transcript.trim() !== '') {
      const updatedTranscripts = [transcript, ...savedTranscripts.slice(0, 49)];
      setSavedTranscripts(updatedTranscripts);
      localStorage.setItem('savedTranscripts', JSON.stringify(updatedTranscripts));
    }
    setTranscript('');
    setIsListening(false);
    setTimeout(() => setIsListening(true), 100);
  };

  const handleAddLine = (line) => {
    setQuery((prevQuery) => prevQuery + ' ' + line.join(' '));
  };

  const handleAddWord = (word) => {
    setQuery((prevQuery) => prevQuery + ' ' + word);
  };

  const handleSearch = (line) => {
    console.log('line', line);
    const prompt = line.join(' ');
    setQuery(prompt);
    submitPrompt(prompt);
  };

  const handleLoadTranscript = (savedTranscript) => {
    setTranscript(savedTranscript);
  };

  return (
    <div>
      <div className="justify-left scrollbar-thin scrollbar-thumb-black-500 scrollbar-track-gray-600 -mt-3 mb-2 ml-6 mr-6 flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setIsListening((prevState) => !prevState)}
          className="rounded-full border border-[#60c4d6] bg-transparent p-1 transition-colors duration-200 hover:bg-[#60c4d6] hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-[#60c4d6] focus:ring-offset-2"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={isListening ? 'yellowgreen' : 'black'}
            className="text-black"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14ZM18 11C18 14.31 15.31 17 12 17C8.69 17 6 14.31 6 11H4C4 15.08 7.05 18.44 11 18.93V22H13V18.93C16.95 18.44 20 15.08 20 11H18Z" />
          </svg>
        </button>
        <button
          onClick={refreshSpeechToText}
          className="rounded-full border border-[#60c4d6] bg-transparent p-1 transition-colors duration-200 hover:bg-[#60c4d6] hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-[#60c4d6] focus:ring-offset-2"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="black"
            className="text-black"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z" />
          </svg>
        </button>
        <button
          onClick={() => setQuery(transcript)}
          className="rounded-full border border-[#60c4d6] bg-transparent p-1 transition-colors duration-200 hover:bg-[#60c4d6] hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-[#60c4d6] focus:ring-offset-2"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="black"
            className="text-black"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M14 7l-5 5 5 5V7z" />
            <path d="M5 5v14h14v-7h2v7c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h7v2H5z" />
          </svg>
        </button>
        {savedTranscripts.map((savedTranscript, index) => (
          <button
            key={index}
            onClick={() => handleLoadTranscript(savedTranscript)}
            className="m-1 rounded border border-[#60c4d6] bg-transparent px-1 text-black transition-colors duration-200 hover:bg-[#60c4d6] hover:bg-opacity-20"
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div
        ref={transcriptDivRef}
        style={{
          color: 'black',
          padding: '10px',
          fontSize: '18px',
          maxHeight: '500px',
          overflowY: 'auto',
          scrollBehavior: 'smooth',
        }}
      >
        {transcript
          .split(' ')
          .reduce((acc, word, index) => {
            if (index % 8 === 0) {
              acc.push([]);
            }
            acc[acc.length - 1].push(word);
            return acc;
          }, [])
          .map((line, lineIndex) => (
            <div key={lineIndex} style={{ marginBottom: '10px' }}>
              {line.map((word, wordIndex) => (
                <span
                  key={wordIndex}
                  style={{ cursor: 'pointer', marginRight: '5px' }}
                  onClick={() => handleAddWord(word)}
                >
                  {word}
                </span>
              ))}
              <button
                onClick={() => handleAddLine(line)}
                className="mx-1 rounded-full border border-[#60c4d6] bg-transparent p-0.5 transition-colors duration-200 hover:bg-[#60c4d6] hover:bg-opacity-20 focus:outline-none focus:ring-1 focus:ring-[#60c4d6] focus:ring-opacity-50"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="black" />
                </svg>
              </button>
              <button
                onClick={() => handleSearch(line)}
                className="mx-1 rounded-full border border-[#60c4d6] bg-transparent p-0.5 transition-colors duration-200 hover:bg-[#60c4d6] hover:bg-opacity-20 focus:outline-none focus:ring-1 focus:ring-[#60c4d6] focus:ring-opacity-50"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
                    fill="black"
                  />
                </svg>
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SpeechToText;
