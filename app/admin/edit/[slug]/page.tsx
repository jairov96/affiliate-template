// pages/admin/edit/[slug]/page.tsx
"use client";
import PostEditor from "../../../components/PostEditor";
import { useState, useEffect } from "react";
import grayMatter from "gray-matter";

interface pageProps {
  params: {slug: string};
}

const EditPostPage: React.FC<pageProps> = ({params}) => {
  const slug  = params.slug;
  
  const [markdownContent, setMarkdownContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  //const { data } = grayMatter(markdownContent);



  useEffect(() => {
    // Fetch the post content when the page is loaded
    console.log("do we get here?")
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${slug}?fields=content`);
        const post = await response.json();
        console.log(`post = ${post.content}`);
        setMarkdownContent(post.content);
      } catch (error: any) {
        setFeedbackMessage(error.message || "Failed to fetch post content.");
        setMarkdownContent("No data was fetched.");
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const handlePostUpdate = async () => {
    setIsLoading(true);
    setFeedbackMessage(null);

    try {
      const response = await fetch(`/api/posts/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${process.env.ADMIN_AUTH_SECRET}`
        },
        body: JSON.stringify({ markdown: markdownContent }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to update post.");
      }
      
      setFeedbackMessage("Post successfully updated!");
    } catch (error: any) {
      setFeedbackMessage(error.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 mx-5 my-5 md:w-2/3 md:mx-auto">
      <h1></h1>
      <p className="">Edit post with slug: {slug} and {process.env.ADMIN_AUTH_SECRET}</p>
      <PostEditor
        markdown={markdownContent}
        onContentChange={setMarkdownContent}
      />
      {/* ... display metadata and feedback message as before ... */}
      <button
        className={`mt-6 px-6 py-3 rounded-md focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 
        ${
          markdownContent
            ? " duration-500 bg-blue-600 text-white hover:bg-blue-700"
            : " duration-500 bg-gray-400 text-gray-700 cursor-not-allowed"
        }`}
        onClick={handlePostUpdate}
      >
        {isLoading ? "Updating..." : "Update"}
      </button>
    </div>
  );
};

export default EditPostPage;
