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
  // console.log("page -> input", input, "messages", messages);

  const handleChange = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [name]: value,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow overflow-y-auto p-4 max-w-3xl mx-auto">
        <div className="mx-auto space-y-2">
          <h2 className="text-3xl font-bold">Mr. A.I. Jokatastic</h2>
          <p className="text-zinc-500 dark:text-zinc-400">What type of joke would you like to hear today?</p>
        </div>
        <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4 mt-4">
          <h3 className="text-xl font-semibold">Type</h3>

          <div className="flex flex-wrap justify-center">
            {jokeTypes.map(({ value, emoji }) => (
              <div key={value} className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg">
                <input id={value} type="radio" value={value} name="jokeType" onChange={handleChange} />
                <label className="ml-2" htmlFor={value}>
                  {`${emoji} ${value}`}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4 mt-4">
          <h3 className="text-xl font-semibold">Topic</h3>

          <div className="flex flex-wrap justify-center">
            {topics.map(({ value, emoji }) => (
              <div key={value} className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg">
                <input id={value} type="radio" value={value} name="genre" onChange={handleChange} />
                <label className="ml-2" htmlFor={value}>
                  {`${emoji} ${value}`}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4 mt-2">
          <h3 className="text-xl font-semibold">Tones</h3>

          <div className="flex flex-wrap justify-center">
            {tones.map(({ value, emoji }) => (
              <div key={value} className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg">
                <input id={value} type="radio" name="tone" value={value} onChange={handleChange} />
                <label className="ml-2" htmlFor={value}>
                  {`${emoji} ${value}`}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4 mt-2">
          <h3 className="text-xl font-semibold">Temperature</h3>

          <div className="flex items-center justify-center space-x-4">
            <span role="img" aria-label="Deterministic">
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
              className="w-64 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span role="img" aria-label="Random">
              🎲
            </span>
          </div>
          <p className="text-center mt-2">
            Temperature: {state.temperature || constants.openAI.temperature} (
            {Number(state.temperature) < 0.5 ? "More deterministic" : "More random"})
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
        </div>
      </div>
    </div>
  );
}
