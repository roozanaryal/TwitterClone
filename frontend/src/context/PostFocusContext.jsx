import { useRef } from "react";
import PropTypes from "prop-types";
import { PostFocusContext } from "../hooks/usePostFocus.js";

export const PostFocusProvider = ({ children }) => {
  const focusFn = useRef(() => {});
  return (
    <PostFocusContext.Provider
      value={{
        setFocusFn: (fn) => {
          focusFn.current = fn;
        },
        focusPostInput: () => {
          focusFn.current();
        },
      }}
    >
      {children}
    </PostFocusContext.Provider>
  );
};

PostFocusProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
