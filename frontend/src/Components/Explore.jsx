import { Outlet } from "react-router-dom";
import LeftSideBar from "./LeftSidebar";
import RightSideBar from "./RightSidebar";
// import Tweet from "./Tweet";

const Explore = () => {
  return (
    <div className="flex justify-between w-full lg:w-[80%] mx-auto ">
      <LeftSideBar />
      <div className="w-[50%] border-x border-gray-200 min-h-screen">
        <Outlet />
      </div>
      <RightSideBar />
    </div>
  );
};

export default Explore;

