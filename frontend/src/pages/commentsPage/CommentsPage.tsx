import DeleteComment from "../../components/deleteComment/DeleteComment";
import EditComment from "../../components/editComment/EditComment";
import GetComments from "../../components/getComments/GetComments";
import GetTopLevelCmtReplies from "../../components/getTopLevelCommentReplies/GetTopLevelCmtReplies";
import Comments from "../../components/postComments/PostComments";
import ReplyComment from "../../components/replyComment/ReplyComment";

const CommentsPage = () => {
  return (
    <section>
      <div
        style={{
          width: "85%",
          margin: "0 auto",
          padding: "0 1rem",
          marginTop: "4rem",
        }}
      >
        <GetComments />
        <Comments />
        <ReplyComment />
        <GetTopLevelCmtReplies />
        <EditComment />
        <DeleteComment />
      </div>
    </section>
  );
};

export default CommentsPage;
