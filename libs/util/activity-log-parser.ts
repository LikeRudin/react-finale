interface LogArgument {
  activity: string;
  id: number;
  secondId?: number;
}

interface ActivityLog {
  message: string;
  link: string;
}

export const activityLogParser = ({
  activity,
  id,
  secondId,
}: LogArgument): ActivityLog => {
  switch (activity) {
    case "Stream":
      return {
        message: "새 Stream을 만들었어요.",
        link: "/streams/${id}",
      };
    case "MeetUp":
      return {
        message: "새 MeetUp 게시글을 작성했어요",
        link: `/meets/${id}`,
      };
    case "MeetUpEdit":
      return {
        message: "MeetUp 게시글의 내용을 수정했어요",
        link: `/meets/${id}`,
      };
    case "MeetUpLike":
      return {
        message: "MeetUp좋아요 를 눌렀어요",
        link: `/meets/${id}`,
      };
    case "MeetUpComment":
      return {
        message: "MeetUP댓글을 작성했어요",
        link: `/meets/${id}`,
      };
    case "MeetUpCommentEdit":
      return {
        message: "MeetUp댓글을 수정했어요.",
        link: `/meets/${id}`,
      };
    case "MeetUpCommentLike":
      return {
        message: "MeetUp댓글좋아요를 표시했어요",
        link: `/meets/${id}`,
      };
    case "MeetUpCommentDelete":
      return {
        message: "MeetUp댓글을 삭제했어요.",
        link: `/meets/${id}`,
      };
    case "Review":
      return {
        message: "새 Review를 작성했어요.",
        link: `/meets/${id}/review/${secondId}`,
      };
    case "ReviewEdit":
      return {
        message: "Review를 수정했어요.",
        link: `/meets/${id}/review/${secondId}`,
      };
    case "ReviewLike":
      return {
        message: "Review좋아요를 표시했어요",
        link: `/meets/${id}/review/${secondId}`,
      };
    case "ReviewCommentEdit":
      return {
        message: "Review댓글을 수정했어요.",
        link: `/meets/${id}/review/${secondId}`,
      };
    case "ReviewCommentLike":
      return {
        message: "Review댓글좋아요를 표시했어요",
        link: `/meets/${id}/review/${secondId}`,
      };
    case "Post":
      return {
        message: "새 커뮤니티 게시글을 작성했어요",
        link: `/community/${id}`,
      };
    case "PostEdit":
      return {
        message: "커뮤니티 게시글을 수정했어요",
        link: `/community/${id}`,
      };
    case "PostLike":
      return {
        message: "커뮤니티 게시글좋아요를 눌렀어요",
        link: `/community/${id}`,
      };
    case "Comment":
      return {
        message: "커뮤니티 게시글 댓글을 작성했어요",
        link: `/community/${id}`,
      };
    case "CommentEdit":
      return {
        message: "커뮤니티 게시글 댓글을 수정했어요 ",
        link: `/community/${id}`,
      };
    case "CommentLike":
      return {
        message: "커뮤니티댓글 좋아요를 표시했어요",
        link: `/community/${id}`,
      };
    case "MeetUpJoin":
      return {
        message: "MeetUp 참여 의사를 밝혔어요",
        link: `/meets/${id}`,
      };
    default: {
      return {
        message: "개발자가 누락했어요",
        link: "/",
      };
    }
  }
};
