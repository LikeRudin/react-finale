interface LogArgument {
  notification: string;
  id: number;
  secondId?: number;
}

interface Log {
  message: string;
  link: string;
}
export const notificationLogParser = ({
  notification,
  id,
  secondId,
}: LogArgument): Log => {
  switch (notification) {
    case "MeetUpLike":
      return {
        message: "MeetUp이 좋아요를 받았어요",
        link: `/meets/${id}`,
      };
    case "MeetUpComment":
      return {
        message: "MeetUp이 댓글을 받았어요 ",
        link: `/meets/${id}`,
      };
    case "MeetUpCommentLike":
      return {
        message: "MeetUp댓글이 좋아요를 받았어요 ",
        link: `/meets/${id}`,
      };
    case "MeetUpCommentReply":
      return {
        message: "MeetUp댓글에 답글을 받았어요",
        link: `/meets/${id}`,
      };
    case "Review":
      return {
        message: "MeetUp이 리뷰를 받았어요",
        link: `/meets/${id}`,
      };
    case "ReviewLike":
      return {
        message: "Review가 좋아요를 받았어요",
        link: `/meets/${id}/reviews/${secondId}`,
      };
    case "ReviewComment":
      return {
        message: "Review가 댓글을 받았어요",
        link: `/meets/${id}/reviews/${secondId}`,
      };
    case "ReviewCommentLike":
      return {
        message: "Review댓글이 좋아요를 받았어요",
        link: `/meets/${id}/reviews/${secondId}`,
      };
    case "Post":
      return {
        message: "커뮤니티 게시글에 답글을 받았어요.",
        link: `/community/${id}`,
      };
    case "PostLike":
      return {
        message: "커뮤니티 게시글이 좋아요를 받았어요",
        link: `/community/${id}`,
      };
    case "Comment":
      return {
        message: "커뮤니티 게시글에 댓글을 받았어요.",
        link: `/community/${id}`,
      };
    case "CommentLike":
      return {
        message: "커뮤니티 댓글에 좋아요를 받았어요",
        link: `/community/${id}`,
      };
    case "MeetUpJoin":
      return {
        message: "MeetUp에 새로운 사람이 합류했어요",
        link: `/meets/${id}`,
      };
    default:
      return {
        message: "개발자가 누락했어요",
        link: `/`,
      };
  }
};
