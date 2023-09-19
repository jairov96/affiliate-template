import React, { useState } from 'react';
import { MDXEditor } from '@mdxeditor/editor/MDXEditor';

function NewPostForm() {
    const defaultTemplate = `
---
title: Example Title
description: Description
slug: Slug
---

Your content goes here...
`;

    const [mdxContent, setMdxContent] = useState<string>(defaultTemplate);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Send the MDX content to your API endpoint
        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mdxContent }),
        });

        const data = await response.json();
        // Handle the response as needed
    }

    const getMetadataPreview = () => {
        const metadata = mdxContent.split('---')[1].trim().split('\n');
        return metadata.map((meta) => <p key={meta}>{meta}</p>);
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="flex flex-col">
                <MDXEditor 
                    markdown={mdxContent} 
                    onChange={(value: string) => setMdxContent(value)} 
                    className="w-full mb-4 border rounded-md p-2"
                />
                <button type="submit" className="self-end bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Create Post
                </button>
            </form>
            <div className="mt-4">
                <h2 className="text-xl font-bold mb-2">Metadata Preview:</h2>
                {getMetadataPreview()}
            </div>
        </div>
    );
}

export default NewPostForm;
