import DeleteComment from "../../components/test/deleteComment/DeleteComment";
import EditComment from "../../components/test/editComment/EditComment";
import GetComments from "../../components/test/getComments/GetComments";
import GetTopLevelCmtReplies from "../../components/test/getTopLevelCommentReplies/GetTopLevelCmtReplies";
import Comments from "../../components/test/postComments/PostComments";
import ReplyComment from "../../components/test/replyComment/ReplyComment";

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
