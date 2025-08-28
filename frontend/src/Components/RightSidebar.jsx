import { CiSearch } from "react-icons/ci";
import Avatar from "react-avatar";
import { useState, useEffect, useCallback } from "react";
import PropTypes from 'prop-types';
import useAPICall from "../api/useAPICall";
import { useAuthContext } from "../context/AuthContext";

// UserCard component for displaying user info with follow button
const UserCard = ({ user }) => {
   const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);
   const [isLoading, setIsLoading] = useState(false);
   const callAPI = useAPICall();

   const handleFollow = async () => {
      setIsLoading(true);
      try {
         if (isFollowing) {
            await callAPI(`users/unfollow/${user._id}`, 'POST');
            setIsFollowing(false);
         } else {
            await callAPI(`users/follow/${user._id}`, 'POST');
            setIsFollowing(true);
         }
      } catch (error) {
         console.error('Error following/unfollowing user:', error);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="flex items-center justify-between py-3">
         <div className="flex items-center">
            <Avatar
               src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.fullName || user.name}&background=random`}
               size="40"
               round={true}
            />
            <div className="ml-3">
               <h3 className="font-bold text-sm">{user.fullName}</h3>
               <p className="text-gray-500 text-sm">@{user.username}</p>
            </div>
         </div>
         <button 
            className={`px-4 py-1 rounded-full text-sm font-bold transition-colors ${
               isFollowing 
                  ? 'bg-gray-200 text-black hover:bg-gray-300' 
                  : 'bg-black text-white hover:bg-gray-800'
            }`}
            onClick={handleFollow}
            disabled={isLoading}
         >
            {isLoading ? '...' : isFollowing ? 'Unfollow' : 'Follow'}
         </button>
      </div>
   );
};

UserCard.propTypes = {
   user: {
      _id: PropTypes.string.isRequired,
      fullName: PropTypes.string,
      username: PropTypes.string.isRequired,
      profilePicture: PropTypes.string,
      isFollowing: PropTypes.bool
   }
};

const RightSidebar = () => {
   const [searchQuery, setSearchQuery] = useState("");
   const [searchResults, setSearchResults] = useState([]);
   const [suggestedUsers, setSuggestedUsers] = useState([]);
   const [isSearching, setIsSearching] = useState(false);
   const callAPI = useAPICall();
   const { authUser } = useAuthContext();

   // Fetch suggested users only once when component mounts
   const [hasFetchedSuggested, setHasFetchedSuggested] = useState(false);
   
   useEffect(() => {
      if (!authUser || hasFetchedSuggested) return;
      
      const fetchSuggestedUsers = async () => {
         try {
            const data = await callAPI('users/suggested', 'GET');
            setSuggestedUsers(data.users || []);
            setHasFetchedSuggested(true);
         } catch (error) {
            console.error('Error fetching suggested users:', error);
         }
      };

      fetchSuggestedUsers();
   }, [authUser, hasFetchedSuggested, callAPI]);

   // Handle search
   const handleSearch = useCallback(async (query) => {
      if (!query.trim()) {
         setSearchResults([]);
         setIsSearching(false);
         return;
      }

      setIsSearching(true);
      try {
         // Test with a simple fetch first to debug
         const response = await fetch(`http://localhost:5000/api/users/search?q=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
            },
            credentials: 'include',
         });
         
         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
         }
         
         const data = await response.json();
         console.log('Search API response:', data);
         setSearchResults(data.users || []);
      } catch (error) {
         console.error('Error searching users:', error);
         console.error('Full error details:', error.message);
         setSearchResults([]);
      } finally {
         setIsSearching(false);
      }
   }, []);

   // Debounced search
   useEffect(() => {
      const timer = setTimeout(() => {
         handleSearch(searchQuery);
      }, 300);

      return () => clearTimeout(timer);
   }, [searchQuery, handleSearch]);

   return (
      <div className="p-4">
         <div className="flex items-center p-3 mb-4 bg-gray-100 rounded-full">
            <CiSearch size="20px" className="text-gray-500" />
            <input
               type="text"
               className="bg-transparent outline-none px-2 w-full"
               placeholder="Search Twitter"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>

         {/* Search Results */}
         {searchQuery && (
            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
               <h2 className="font-bold text-xl mb-4">Search Results</h2>
               {isSearching ? (
                  <div className="text-center py-4">
                     <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                     <p className="text-gray-500 mt-2">Searching...</p>
                  </div>
               ) : searchResults.length > 0 ? (
                  <div className="space-y-2">
                     {searchResults.map((user) => (
                        <UserCard key={user._id} user={user} />
                     ))}
                  </div>
               ) : (
                  <div className="text-center py-4">
                     <p className="text-gray-500">No users found for &quot;{searchQuery}&quot;</p>
                     <p className="text-gray-400 text-sm mt-1">Try searching for a different name or username</p>
                  </div>
               )}
            </div>
         )}
         <div className="bg-gray-50 rounded-2xl p-4">
            <h2 className="font-bold text-xl mb-4">Who to follow</h2>
            {suggestedUsers.length > 0 ? (
               suggestedUsers.slice(0, 3).map((user) => (
                  <UserCard key={user._id} user={user} />
               ))
            ) : (
               <>
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
               </>
            )}
            
            <button className="text-blue-500 text-sm mt-2 hover:underline">
               Show more
            </button>
         </div>
      </div>
   );
};

export default RightSidebar;
