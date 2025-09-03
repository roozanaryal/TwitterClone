import { memo, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import Tweet from './Tweet';
import PropTypes from 'prop-types';

const TWEET_HEIGHT = 200; // Approximate height per tweet

const TweetItem = memo(({ index, style, data }) => {
  const { posts, authUserId, onPostUpdate } = data;
  const post = posts[index];

  if (!post) return null;

  return (
    <div style={style}>
      <Tweet
        post={post}
        authUserId={authUserId}
        enableInteractions={true}
        onPostUpdate={onPostUpdate}
      />
    </div>
  );
});

TweetItem.displayName = 'TweetItem';
TweetItem.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

const VirtualizedTweetList = memo(({ posts, authUserId, onPostUpdate, height = 600 }) => {
  const itemData = useMemo(() => ({
    posts,
    authUserId,
    onPostUpdate,
  }), [posts, authUserId, onPostUpdate]);

  if (!posts.length) {
    return (
      <div className="p-6 text-center text-gray-500">
        No posts available.
      </div>
    );
  }

  return (
    <List
      height={height}
      itemCount={posts.length}
      itemSize={TWEET_HEIGHT}
      itemData={itemData}
      overscanCount={5} // Render 5 extra items for smoother scrolling
    >
      {TweetItem}
    </List>
  );
});

VirtualizedTweetList.displayName = 'VirtualizedTweetList';
VirtualizedTweetList.propTypes = {
  posts: PropTypes.array.isRequired,
  authUserId: PropTypes.string,
  onPostUpdate: PropTypes.func,
  height: PropTypes.number,
};

export default VirtualizedTweetList;
