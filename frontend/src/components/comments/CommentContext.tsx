import { createContext, useContext, useState, ReactNode } from "react";

interface CommentState {
  [commentId: string]: { likeStatus: "like" | "dislike" | null };
}

interface CommentContextType {
  commentStates: CommentState;
  setLikeStatus: (commentId: string, status: "like" | "dislike" | null) => void;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export const CommentProvider = ({ children }: { children: ReactNode }) => {
  const [commentStates, setCommentStates] = useState<CommentState>({});

  const setLikeStatus = (
    commentId: string,
    status: "like" | "dislike" | null
  ) => {
    setCommentStates((prev) => ({
      ...prev,
      [commentId]: { likeStatus: status },
    }));
  };

  return (
    <CommentContext.Provider value={{ commentStates, setLikeStatus }}>
      {children}
    </CommentContext.Provider>
  );
};

export const useCommentContext = () => {
  const context = useContext(CommentContext);
  if (!context)
    throw new Error("useCommentContext must be used within a CommentProvider");
  return context;
};
