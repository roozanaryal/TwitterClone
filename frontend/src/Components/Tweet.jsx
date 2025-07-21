import Avatar from "react-avatar";
import { FaRegComment } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { CiBookmark } from "react-icons/ci";

const dummyTweets = [
  {
    id: 1,
    avatar: "https://imgs.search.brave.com/JGCZZygUlFTk8RW8L5uyeuIACCp0BsQI8IhaYyZmS4k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9yZXMu/Y2xvdWRpbmFyeS5j/b20vZGVtby9pbWFn/ZS91cGxvYWQvd18x/NTAsaF8xNTAsY19m/aWxsLGdfZmFjZSxy/X21heC9mcm9udF9m/YWNlLnBuZw",
    name: "Roozan Aryal",
    username: "roozan_aryal",
    time: "1m",
    content: "Hello Developers lets Connect",
    comments: 0,
    likes: 0,
    bookmarks: 0,
  },
  {
    id: 2,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "John Doe",
    username: "john_doe",
    time: "2m",
    content: "This is another tweet!",
    comments: 3,
    likes: 5,
    bookmarks: 1,
  },
];

const Tweet = () => {
  return (
    <div className="w-full">
      {dummyTweets.map((tweet) => (
        <div className="border-b border-gray-200 w-full" key={tweet.id}>
          <div>
            <div className="flex p-4">
              <Avatar src={tweet.avatar} size="40" round={true} />
              <div className="ml-2">
                <div className="flex items-center ml-2">
                  <h1 className="font-bold">{tweet.name}</h1>
                  <p className="text-gray-500 text-sm ml-1">
                    @{tweet.username} . {tweet.time}
                  </p>
                </div>
                <div>
                  <p>{tweet.content}</p>
                </div>
                <div className="flex justify-between my-3">
                  <div className="flex items-center">
                    <div className="p-2 hover:bg-blue-200 rounded-full cursor-pointer">
                      <FaRegComment size="20px" />
                    </div>
                    <p>{tweet.comments}</p>
                  </div>
                  <div className="flex items-center">
                    <div className="p-2 hover:bg-red-200 rounded-full cursor-pointer">
                      <CiHeart size="20px" />
                    </div>
                    <p>{tweet.likes}</p>
                  </div>
                  <div className="flex items-center">
                    <div className="p-2 hover:bg-blue-200 rounded-full cursor-pointer">
                      <CiBookmark size="20px" />
                    </div>
                    <p>{tweet.bookmarks}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tweet;
