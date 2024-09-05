"use client";
import { useState } from "react";
import { useChat } from "ai/react";
import { getApiUrl } from "@lib/api.ts";
import { constants } from "@lib/constants.ts";
import { jokeTypes, topics, tones } from "@lib/jokeParams";

export default function Chat() {
  const [state, setState] = useState({
    jokeType: "",
    genre: "",
    tone: "",
    temperature: "" + constants.openAI.temperature,
    evaluation: "",
    isEvaluated: false, // Add isEvaluated state
  });
  const { messages, append, isLoading } = useChat({
    api: getApiUrl(constants.routes.api.chat),
    keepLastMessageOnError: true,
    onError(error) {
      console.log("error", error);
    },
    body: {
      temperature: parseFloat(state.temperature),
    },
  });

  // Function to evaluate the joke
  const evaluateJoke = async (joke: string) => {
    // Replace with your evaluation logic or API call
    const evaluation = await fetch(getApiUrl(constants.routes.api.evaluate), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ joke }),
    }).then((res) => res.json());
    console.log("page -> evaluateJoke -> evaluation", evaluation.text);
    setState((prevState) => ({
      ...prevState,
      evaluation: evaluation.text, // Assuming the API returns { result: "funny" | "appropriate" | "offensive" }
      isEvaluated: true, // Set isEvaluated to true after evaluation
    }));
  };

  const handleChange = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [name]: value,
      isEvaluated: false, // Reset isEvaluated when a new joke is generated
    });
  };

  const handleEvaluateClick = () => {
    if (messages.length > 0 && !messages[messages.length - 1]?.content.startsWith("Generate")) {
      evaluateJoke(messages[messages.length - 1]?.content);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow overflow-y-auto p-4 max-w-3xl mx-auto">
        <div className="mx-auto space-y-4 text-center">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Mr. A.I. Jokatastic
          </h1>
          <p className="text-lg text-zinc-400 dark:text-purple-300 max-w-2xl mx-auto">
            What type of joke would you like to hear today?
          </p>
        </div>
        <div className="space-y-6 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 mt-6 shadow-lg">
          <h3 className="text-2xl font-bold text-center text-white mb-4">Type</h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {jokeTypes.map(({ value, emoji }) => (
              <div key={value} className="relative">
                <input
                  id={value}
                  type="radio"
                  value={value}
                  name="jokeType"
                  onChange={handleChange}
                  className="peer absolute opacity-0 w-full h-full cursor-pointer"
                />
                <label
                  htmlFor={value}
                  className="flex flex-col items-center justify-center p-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg border-2 border-transparent transition-all duration-300 cursor-pointer
                             hover:bg-opacity-20 hover:border-purple-300
                             peer-checked:bg-opacity-30 peer-checked:border-purple-500 peer-checked:text-purple-200"
                >
                  <span className="text-3xl mb-2">{emoji}</span>
                  <span className="font-medium text-white">{value}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 mt-6 shadow-lg">
          <h3 className="text-2xl font-bold text-center text-white mb-4">Topic</h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {topics.map(({ value, emoji }) => (
              <div key={value} className="relative">
                <input
                  id={value}
                  type="radio"
                  value={value}
                  name="genre"
                  onChange={handleChange}
                  className="peer absolute opacity-0 w-full h-full cursor-pointer"
                />
                <label
                  htmlFor={value}
                  className="flex flex-col items-center justify-center p-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg border-2 border-transparent transition-all duration-300 cursor-pointer
                             hover:bg-opacity-20 hover:border-purple-300
                             peer-checked:bg-opacity-30 peer-checked:border-purple-500 peer-checked:text-purple-200"
                >
                  <span className="text-3xl mb-2">{emoji}</span>
                  <span className="font-medium text-white">{value}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 mt-6 shadow-lg">
          <h3 className="text-2xl font-bold text-center text-white mb-4">Tones</h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {tones.map(({ value, emoji }) => (
              <div key={value} className="relative">
                <input
                  id={value}
                  type="radio"
                  value={value}
                  name="tone"
                  onChange={handleChange}
                  className="peer absolute opacity-0 w-full h-full cursor-pointer"
                />
                <label
                  htmlFor={value}
                  className="flex flex-col items-center justify-center p-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg border-2 border-transparent transition-all duration-300 cursor-pointer
                             hover:bg-opacity-20 hover:border-purple-300
                             peer-checked:bg-opacity-30 peer-checked:border-purple-500 peer-checked:text-purple-200"
                >
                  <span className="text-3xl mb-2">{emoji}</span>
                  <span className="font-medium text-white">{value}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 mt-6 shadow-lg">
          <h3 className="text-2xl font-bold text-center text-white mb-4">Set Temperature</h3>

          <div className="flex items-center justify-center space-x-4">
            <span role="img" aria-label="Deterministic" className="text-3xl">
              🧊
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={state.temperature}
              onChange={handleChange}
              name="temperature"
              className="w-64 h-2 bg-white bg-opacity-30 rounded-lg appearance-none cursor-pointer"
            />
            <span role="img" aria-label="Random" className="text-3xl">
              🎲
            </span>
          </div>
          <p className="text-center mt-2 text-white">
            Temperature: {state.temperature || constants.openAI.temperature}
            <br />
            <span className="text-sm text-purple-200">
              ({Number(state.temperature) < 0.5 ? "More deterministic" : "More random"})
            </span>
          </p>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-2 rounded disabled:opacity-50"
          disabled={isLoading || !state.jokeType || !state.genre || !state.tone}
          onClick={() =>
            append({
              role: "user",
              content: `Generate a ${state.jokeType} type of joke for the topic of ${state.genre} in a ${state.tone} tone`,
            })
          }
        >
          Generate Joke
        </button>
        <div
          hidden={messages.length === 0 || messages[messages.length - 1]?.content.startsWith("Generate")}
          className="bg-opacity-25 bg-gray-700 rounded-lg p-4 mt-5"
        >
          {messages[messages.length - 1]?.content}
          {!isLoading && (
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mt-2 rounded"
              onClick={handleEvaluateClick}
            >
              Evaluate Joke
            </button>
          )}
        </div>
        <div hidden={!state.isEvaluated} className="bg-opacity-25 bg-gray-700 rounded-lg p-4 mt-5">
          <h3 className="text-xl font-semibold">Joke Evaluation</h3>
          <p>{state.evaluation}</p>
        </div>
      </div>
    </div>
  );
}
