import { CiHome } from "react-icons/ci";
import { CiHashtag } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import { CiBookmark } from "react-icons/ci";
import { AiOutlineLogout } from "react-icons/ai";
import { Link } from "react-router-dom";

const LeftSidebar = () => {
   return (
      <>
         <div className="w-[20%] max-lg:w-fit">
  <div className="flex flex-col items-start max-lg:items-center gap-2 py-4">
    <img
      className="ml-5 max-lg:ml-0 h-8"
      src="https://imgs.search.brave.com/ZhDTc19u3Xv8PyZhNmN3n3svlp1Wr_pndpywRRjXxjU/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly8xMDAw/bG9nb3MubmV0L3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDE3LzA2/L1R3aXR0ZXItTG9n/JUQwJUJFLTUwMHgy/ODEucG5n"
      alt="Twitter-Logo"
    />
    <div className="flex flex-col gap-2 w-full max-lg:items-center">
                  <Link to="/" className="flex items-center my-2 px-4 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full max-lg:justify-center max-lg:my-0 max-lg:px-0 max-lg:py-2 max-lg:mx-auto">
                     <div>
                        <CiHome size="24px" />
                     </div>
                     <h2 className="max-lg:hidden">Home</h2>
                  </Link>

                  <div className="flex items-center my-2 px-4 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full max-lg:justify-center max-lg:my-0 max-lg:px-0 max-lg:py-2 max-lg:mx-auto">
                     <div>
                        <CiHashtag size="24px" />
                     </div>
                     <h2 className="max-lg:hidden">Explore</h2>
                  </div>
                  <div className="flex items-center my-2 px-4 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full max-lg:justify-center max-lg:my-0 max-lg:px-0 max-lg:py-2 max-lg:mx-auto">
                     <div>
                        <IoIosNotificationsOutline size="24px" />
                     </div>
                     <h2 className="max-lg:hidden">Notification</h2>
                  </div>
                  <Link
                     to="/profile"
                     className="flex items-center my-2 px-4 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full max-lg:justify-center max-lg:my-0 max-lg:px-0 max-lg:py-2 max-lg:mx-auto"
                  >
                     <div>
                        <CiUser size="24px" />
                     </div>
                     <h2 className="max-lg:hidden">Profile</h2>
                  </Link>
                  <div className="flex items-center my-2 px-4 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full max-lg:justify-center max-lg:my-0 max-lg:px-0 max-lg:py-2 max-lg:mx-auto">
                     <div>
                        <CiBookmark size="24px" />
                     </div>
                     <h2 className="max-lg:hidden">Bookmarks</h2>
                  </div>
                  <div className="flex items-center my-2 px-4 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full max-lg:justify-center max-lg:my-0 max-lg:px-0 max-lg:py-2 max-lg:mx-auto">
                     <div>
                        <AiOutlineLogout size="24px" />
                     </div>
                     <h2 className="max-lg:hidden">Logout</h2>
                  </div>

                  <button className="px-4 py-2 border-none text-md bg-[#1D9BF0] w-full rounded-full text-white font-bold max-lg:w-12 max-lg:px-0 max-lg:flex max-lg:items-center max-lg:justify-center max-lg:mx-auto">
  <span className="max-lg:hidden">Post</span>
  <svg className="hidden max-lg:block" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 5c.414 0 .75.336.75.75V11.25h5.5a.75.75 0 0 1 0 1.5h-5.5v5.5a.75.75 0 0 1-1.5 0v-5.5H5.75a.75.75 0 0 1 0-1.5h5.5V5.75c0-.414.336-.75.75-.75Z"/></svg>
</button>
               </div>
            </div>
         </div>
      </>
   );
};

export default LeftSidebar;
