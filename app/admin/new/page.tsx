// pages/admin/new/page.tsx
"use client";
import PostEditor from "../../components/PostEditor";
import { useState } from "react";
import grayMatter from "gray-matter";

const TEMPLATE_MARKDOWN = `---
title: Example Title
description: Description
slug: slug
---

Your content here...
`;

const isValidSlug = (slug: string) => {
  const regex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return regex.test(slug);
};

function NewPostPage() {
  const [markdownContent, setMarkdownContent] = useState(TEMPLATE_MARKDOWN);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const { data } = grayMatter(markdownContent);
  const isMetadataValid = (): boolean => {
    return data.title && data.description && isValidSlug(data.slug) ;
  };
  

  const handlePostCreation = async () => {
    if (!isMetadataValid()) return;

    setIsLoading(true);
    setFeedbackMessage(null);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ markdown: markdownContent }),
      });
    
      const responseData = await response.json(); // Read the JSON body whether the request was successful or not
    
      if (!response.ok) {
      // Use the error message from the API response if available, otherwise use a default message
        throw new Error(responseData.error || "Failed to create post.");
      }
    
      setFeedbackMessage("Post successfully created with SLUG: " + responseData.slug);
      setMarkdownContent(TEMPLATE_MARKDOWN); // Reset the editor content

    } catch (error: any) {
      setFeedbackMessage(error.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 mx-5 my-5 md:w-2/3 md:mx-auto">
      <p className="">Create a new post</p>
      <PostEditor
        markdown={markdownContent}
        onContentChange={setMarkdownContent}
      />

      <div className="mt-5">
        <h2 className="text-xl font-semibold mb-3">Metadata:</h2>
        {Object.keys(data).length === 0 ? (
          <p>No metadata available</p>
        ) : (
          <ul className="list-disc pl-5">
            {Object.entries(data).map(([key, value], index) => (
              <li key={index} className="">
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
            ? " duration-500 bg-blue-600 text-white hover:bg-blue-700"
            : " duration-500 bg-gray-400 text-gray-700 cursor-not-allowed"
        }`}
        onClick={handlePostCreation}
      >
        {isLoading ? "Submitting..." : "Submit"}
      </button>

      <div>
        {feedbackMessage && <p className="mt-6">{feedbackMessage}</p>}
      </div>
    </div>
  );
};

export default NewPostPage;
