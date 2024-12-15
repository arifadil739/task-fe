import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head'
import Link from 'next/link'
import { ToastContainer } from 'react-toastify';

interface LayoutProps {
  children: React.ReactNode
  title?: string
}

export default function Layout({ children, title = 'Task Management' }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/" className="flex-shrink-0 flex items-center cursor-pointer text-black">
                Task Manager
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 px-4">
        {children}
        <ToastContainer />
      </main>
    </div>
  )
}

