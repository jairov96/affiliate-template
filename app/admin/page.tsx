'use client'
import { PostsList } from '../components/PostList';
import NewPostForm from '../components/NewPostForm';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      This is the administrator panel!
      <NewPostForm />
    </main>
  )
}
