'use client'
import { PostsList } from './components/PostList';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Welcome to my blog!
      <PostsList />

    </main>
  )
}
