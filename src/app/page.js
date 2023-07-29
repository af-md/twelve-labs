/* @jsxImportSource react */
"use client";
import "./globals.css";
import getText from "./generateText";
import MyApp from './MyApp';

import { useState } from "react";

const TextAreaWithButton = () => {
  const [inputText, setInputText] = useState("");

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleFormSubmit = () => {
    console.log("Text from the textarea:", inputText);
    getText();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
      <p className="text-center text-white font-semibold mb-4">
        Create your perfect ad by writing a few things about what your ad will
        be about.
      </p>
      <textarea
        className="w-96 h-32 px-4 py-2 border border-gray-300 rounded-lg resize-none mb-4 bg-white text-gray-800"
        placeholder="Type your text here..."
        value={inputText}
        onChange={handleInputChange}
      />
      <button
        className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-3 rounded-md shadow-lg font-bold"
        onClick={handleFormSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default TextAreaWithButton;
