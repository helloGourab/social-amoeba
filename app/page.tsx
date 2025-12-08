import Link from "next/link";
import { Users2, Globe, FileText } from "lucide-react";

export default function RootHomePage() {
  return (
    <main className="container mx-auto p-8 max-w-4xl text-center">
      <h1 className="text-4xl font-extrabold mb-4">
        Welcome to the Application
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        This is the main application landing page. Navigate the content below.
      </p>

      <div className="flex justify-center space-x-4">
        {/* NEW LINK: Personalized Feed */}
        <Link
          href="/feed"
          className="flex flex-col items-center bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition w-48 h-32 justify-center"
        >
          <Users2 className="w-8 h-8 mb-2" />
          <span>Your Personalized Feed</span>
          <span className="text-xs font-light mt-1 opacity-80">
            (Followings)
          </span>
        </Link>

        {/* Updated /posts link */}
        <Link
          href="/posts"
          className="flex flex-col items-center bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-700 transition w-48 h-32 justify-center"
        >
          <Globe className="w-8 h-8 mb-2" />
          <span>Global Feed</span>
          <span className="text-xs font-light mt-1 opacity-80">
            (All Posts)
          </span>
        </Link>

        <Link
          href="/posts/my-posts"
          className="flex flex-col items-center bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition w-48 h-32 justify-center"
        >
          <FileText className="w-8 h-8 mb-2" />
          <span>View My Posts</span>
          <span className="text-xs font-light mt-1 opacity-80">
            (Your Content)
          </span>
        </Link>
      </div>
    </main>
  );
}
