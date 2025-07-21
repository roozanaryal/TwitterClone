import RightSidebar from "./RightSidebar";
import LeftSidebar from "./LeftSidebar";
// import Feed from './Feed'
import { Outlet } from "react-router-dom";
import { PostFocusProvider } from "../context/PostFocusContext";
const Home = () => {
  return (
    <div className="flex justify-between w-full lg:w-[80%] mx-auto ">
      <LeftSidebar />
      <PostFocusProvider>
        <Outlet />
      </PostFocusProvider>
      <RightSidebar />
    </div>
  );
};

export default Home;
