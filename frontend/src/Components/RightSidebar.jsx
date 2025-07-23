import { CiSearch } from "react-icons/ci";
import Avatar from "react-avatar";

const RightSidebar = () => {
   return (
      <div className="p-4">
         <div className="flex items-center p-3 mb-4 bg-gray-100 rounded-full">
            <CiSearch size="20px" className="text-gray-500" />
            <input
               type="text"
               className="bg-transparent outline-none px-2 w-full"
               placeholder="Search Twitter"
            />
         </div>
         <div className="bg-gray-50 rounded-2xl p-4">
            <h2 className="font-bold text-xl mb-4">Who to follow</h2>
            <div className="flex items-center justify-between py-3">
               <div className="flex items-center">
                  <div>
                     <Avatar
                        src="https://imgs.search.brave.com/JGCZZygUlFTk8RW8L5uyeuIACCp0BsQI8IhaYyZmS4k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9yZXMu/Y2xvdWRpbmFyeS5j/b20vZGVtby9pbWFn/ZS91cGxvYWQvd18x/NTAsaF8xNTAsY19m/aWxsLGdfZmFjZSxy/X21heC9mcm9udF9m/YWNlLnBuZw"
                        size="40"
                        round={true}
                     />
                  </div>
                  <div className="ml-3">
                     <h3 className="font-bold text-sm">Roozan Aryal</h3>
                     <p className="text-gray-500 text-sm">@roozan_aryal</p>
                  </div>
               </div>
               <div>
                  <button className="px-4 py-1 bg-black text-white rounded-full text-sm font-bold hover:bg-gray-800 transition-colors">
                  Follow
               </button>
               </div>
         </div>
            
            <div className="flex items-center justify-between py-3">
               <div className="flex items-center">
                  <Avatar
                     src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                     size="40"
                     round={true}
                  />
                  <div className="ml-3">
                     <h3 className="font-bold text-sm">John Doe</h3>
                     <p className="text-gray-500 text-sm">@johndoe</p>
                  </div>
               </div>
               <button className="px-4 py-1 bg-black text-white rounded-full text-sm font-bold hover:bg-gray-800 transition-colors">
                  Follow
               </button>
            </div>
            
            <button className="text-blue-500 text-sm mt-2 hover:underline">
               Show more
            </button>
         </div>
      </div>
   );
};

export default RightSidebar;
