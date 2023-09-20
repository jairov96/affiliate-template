// pages/admin/new.tsx

import PostEditor from '../../components/PostEditor';

const NewPostPage: React.FC = () => {
  const defaultTemplate = `
---
title: Example Title
description: Description
slug: Slug
---

Your content here...
  `;

  const handleCreatePost = (markdown: string) => {
    // API call to save the new post
  };

  return <PostEditor initialContent={defaultTemplate} onSubmit={handleCreatePost} />;
};

export default NewPostPage;
