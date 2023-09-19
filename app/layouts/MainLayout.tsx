import React, { ReactNode } from 'react';

type MainLayoutProps = {
  children: ReactNode;
}


const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4">
        {/* Logo and main navigation links can go here */}
        <h1>My Blog</h1>
      </header>

      <main className="flex-grow p-4">
        {children}
      </main>

      <footer className="bg-gray-900 text-white p-4">
        {/* Footer content */}
        <p>&copy; 2023 My Blog. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default MainLayout;
