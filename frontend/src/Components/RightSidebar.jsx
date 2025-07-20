import { CiSearch } from "react-icons/ci";
import Avatar from "react-avatar";

const RightSidebar = () => {
   return (
      <div className="w-[25%]">
         <div className="flex items-center p-2 my-2 bg-gray-100 rounded-full outline-none w-full">
            <CiSearch size="20px" />
            <input
               type="text"
               className="bg-transparent outline-none px-2"
               placeholder="Search"
            />
         </div>
         <div className="className=' bg-gray-100 rounded-2xl my-4 p-4">
            <h1 className="font-bold text-lg text-center">Who to follow</h1>
            <div className="flex items-center justify-between my-3">
               <div className="flex">
                  <div>
                     <Avatar
                        src="https://imgs.search.brave.com/JGCZZygUlFTk8RW8L5uyeuIACCp0BsQI8IhaYyZmS4k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9yZXMu/Y2xvdWRpbmFyeS5j/b20vZGVtby9pbWFn/ZS91cGxvYWQvd18x/NTAsaF8xNTAsY19m/aWxsLGdfZmFjZSxy/X21heC9mcm9udF9m/YWNlLnBuZw"
                        size="40"
                        round={true}
                     />
                  </div>
                  <div className="ml-2">
                     <h1 className="font-bold">Roozan Aryal</h1>
                     <p className="text-sm">@roozan_aryal</p>
                  </div>
               </div>
               <div>
                  <button className="px-4 py-1 bg-black text-white rounded-full">
                     Profile
                  </button>
               </div>
         </div>
         
         </div>
      </div>
   );
};

export default RightSidebar;
