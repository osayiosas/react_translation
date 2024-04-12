import React, { useState } from "react";
import openai from "openai";
import { BeatLoader } from "react-spinners";

import "./App.css";

const App = () => {
  const [formDate, setFormData] = useState({ lang: "yoruba", massage: "" });

  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [translation, setTranslation] = useState("");

  const openaiKey = import.meta.env.VITE_OPENAI_KEY;
  openai.apiKey = openaiKey;


  const handleInputChange = (e) => {
    setFormData({ ...formDate, [e.target.name]: e.target.value });
    setError("");
  };

  const translate = async () => {
    const { lang, massage } = formDate;
    try {
      const response = await openai.Completion.create({
        engine: 'davici',
        model: "text-davinci-003",
        prompt: `Translate English to ${lang}: ${massage}`,
        temperature: 0.3,
        max_tokens: 100,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      }); 
      setTranslation(response.choices[0].text);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (!formDate.massage) {
      setError("please enter the message");
      return;
    }
    translate();
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(translation)
      .then(() => displayNotification())
      .catch((err) => console.error("faild to copy", err));
  };

  const displayNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };
  return (
    <div className="container">
      <h1>Tranaslation</h1>

      <form onSubmit={handleOnSubmit}>
        <div className="choices">
          <input
            type="radio"
            id="yoruba"
            name="lang"
            value={"yoruba"}
            defaultChecked={formDate.lang}
            onChange={handleInputChange}
          />
          <label htmlFor="yoruba">Yoruba</label>

          {/* igbo */}
          <input
            type="radio"
            id="igbo"
            name="lang"
            value={"igbo"}
            onChange={handleInputChange}
          />
          <label htmlFor="igbo">Igbo</label>

          {/* hausa */}

          <input
            type="radio"
            id="hausa"
            name="lang"
            value={"hausa"}
            onChange={handleInputChange}
          />
          <label htmlFor="hausa">Hausa</label>
        </div>

        <textarea
          name="massage"
          placeholder="Enter your Message"
          onChange={handleInputChange}
        ></textarea>

        {/* error */}
        {error && <div className="error">{error}</div>}
        {/* button */}
        <button type="submit">Translate</button>

        {/* output */}
      </form>

      <div className="translation">
        <div className="copyBtn" onClick={handleCopy}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
            />
          </svg>
        </div>
        Translated text
      </div>

      <div className={`notification ${showNotification ? "active" : ""}`}>
        Copied to clipboard
      </div>
    </div>
  );
};

export default App;
