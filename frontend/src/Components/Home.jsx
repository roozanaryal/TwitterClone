import RightSidebar from "./RightSidebar";
import LeftSidebar from "./LeftSidebar";
import { Outlet } from "react-router-dom";
import { PostFocusProvider } from "../context/PostFocusContext";

const Home = () => {
  return (
    <div className="flex w-full min-h-screen bg-white z-0">
      {/* Left Sidebar */}
      <header className="w-[275px] h-screen flex-shrink-0">
        <div className="fixed w-[275px] p-4 border-r border-gray-200 h-full">
          <LeftSidebar />
        </div>
      </header>

      {/* Main Content */}
      <main className="w-[600px] border-r border-gray-200 min-h-screen">
        <PostFocusProvider>
          <Outlet />
        </PostFocusProvider>
      </main>

      {/* Right Sidebar */}
      <aside className="w-[350px] flex-shrink-0 h-screen hidden lg:block z-0">
        <div className="sticky top-0 w-[350px] p-4 h-screen">
          <RightSidebar />
        </div>
      </aside>
    </div>
  );
};

export default Home;


