import React, { useState } from "react";
import dynamic from "next/dynamic";
import grayMatter from "gray-matter";
import ReactMarkdown from "react-markdown";

import "react-markdown-editor-lite/lib/index.css";

const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: false,
});

interface Metadata {
  title: string;
  description: string;
  slug: string;
  [key: string]: string;
}

const NewPostForm: React.FC = () => {
  const defaultTemplate = `---
title: Example Title
description: Description
slug: Slug
---

Your content here...
`;

  const [mdContent, setMdContent] = useState(defaultTemplate);
  const { data } = grayMatter(mdContent);

  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const isMetadataValid = (): boolean => {
    return data.title && data.description && data.slug;
  };

  const handleSubmit = async () => {
    if (!isMetadataValid()) return;

    setIsLoading(true);
    setFeedbackMessage(null);
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ markdown: mdContent }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post.");
      }

      const responseData = await response.json();
      setFeedbackMessage(
        "Post successfully created with ID: " + responseData.id
      );
      setMdContent(defaultTemplate); // Reset the editor content
    } catch (error: any) {
      setFeedbackMessage(error.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto my-10">
      <MdEditor
        value={mdContent}
        style={{ height: "500px" }}
        onChange={({ text }) => setMdContent(text)}
        renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
      />
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Metadata:</h2>
        {Object.keys(data).length === 0 ? (
          <p>No metadata available</p>
        ) : (
          <ul className="list-disc pl-5">
            {Object.entries(data).map(([key, value], index) => (
              <li key={index}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        className={`mt-6 px-6 py-3 rounded-md focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 
        ${
          isMetadataValid()
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-400 text-gray-700 cursor-not-allowed"
        }`}
        onClick={handleSubmit}
        disabled={!isMetadataValid() || isLoading}
      >
        {isLoading ? "Submitting..." : "Submit"}
      </button>
      <div>
        {feedbackMessage && <p className="mt-6 text-center">{feedbackMessage}</p>}
      </div>
    </div>
  );
};

export default NewPostForm;
