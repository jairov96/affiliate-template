// components/PostEditor.tsx

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import grayMatter from 'gray-matter';
import ReactMarkdown from 'react-markdown';

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), { ssr: false });

interface PostEditorProps {
  initialContent: string;
  onSubmit: (markdown: string) => void;
}

const PostEditor: React.FC<PostEditorProps> = ({ initialContent, onSubmit }) => {
  const [mdContent, setMdContent] = useState(initialContent);

  return (
    <div className="container mx-auto my-10">
      <MdEditor
        value={mdContent}
        style={{ height: '500px' }}
        onChange={({ text }) => setMdContent(text)}
        renderHTML={(text) => <ReactMarkdown children={text} />}
      />
      <button
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200"
        onClick={() => onSubmit(mdContent)}
      >
        Submit
      </button>
    </div>
  );
};

export default PostEditor;
