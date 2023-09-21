import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import grayMatter from "gray-matter";

import "react-markdown-editor-lite/lib/index.css";

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), { ssr: false });

type PostEditorProps = {
  markdown?: string;
  onContentChange: (newContent: string) => void;
};

const TEMPLATE_MARKDOWN = 'title: placeholder';

const PostEditor: React.FC<PostEditorProps> = ({ markdown = TEMPLATE_MARKDOWN, onContentChange }) => {
  const [editorContent, setEditorContent] = useState(markdown);

  useEffect(() => {
    setEditorContent(markdown);
  }, [markdown]);

  const handleEditorChange = ({ text }: { text: string }) => {
    setEditorContent(text);
    onContentChange(text);
  };

  return (
    <MdEditor
      value={editorContent}
      style={{ height: '500px' }}
      onChange={handleEditorChange}
      renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>
    }
    />
  );
};

export default PostEditor;
