export const APIROUTE = {
  ENTER_LOGIN: "/api/users/existence",
  ENTER_PASSWORD: "/api/users/enter",
  ENTER_SIGNIN: "/api/users/available-test",
  ENTER_CREATION: "/api/users",

  MEETS_INDEX: "/api/meets",
  MEETS_DETAIL: (meetUpId: string) => `/api/meets/${meetUpId}`,
  MEETS_LIKE: (meetUpId: string) => `/api/meets/${meetUpId}/like`,
  MEETS_JOIN: (meetUpId: string) => `/api/meets/${meetUpId}/join`,
  MEETS_COMMENTS: (meetUpId: string) => `/api/meets/${meetUpId}/comments`,
  MEETS_COMMENTS_EDIT: (meetUpId: string, commentId: string) =>
    `/api/meets/${meetUpId}/comments/${commentId}`,
  MEETS_COMMENTS_LIKE: (meetUpId: string, commentId: string) =>
    `/api/meets/${meetUpId}/comments/${commentId}/like`,
  MEETS_COMMENTS_REPLY: (meetUpId: string, commentId: string) =>
    `/api/meets/${meetUpId}/comments/${commentId}/reply`,

  MEETS_REVIEWS: (meetUpId: string) => `/api/meets/${meetUpId}/reviews`,
  MEETS_REVIEWS_INDEX: (meetUpId: string, reviewId: string) =>
    `/api/meets/${meetUpId}/reviews/${reviewId}`,
  MEETS_REVIEWS_LIKE: (meetUpId: string, reviewId: string) =>
    `/api/meets/${meetUpId}/reviews/${reviewId}/like`,
  MEETS_REVIEWS_COMMENTS: (meetUpId: string, reviewId: string) =>
    `/api/meets/${meetUpId}/reviews/${reviewId}/comments`,
  MEETS_REVIEWS_COMMENTS_INDEX: (
    meetUpId: string,
    reviewId: string,
    commentId: string
  ) => `/api/meets/${meetUpId}/reviews/${reviewId}/comments/${commentId}`,
  MEETS_REVIEWS_COMMENTS_LIKE: (
    meetUpId: string,
    reviewId: string,
    commentId: string
  ) => `/api/meets/${meetUpId}/reviews/${reviewId}/comments/${commentId}/like`,
  MEETS_REVIEWS_COMMENTS_REPLY: (
    meetUpId: string,
    reviewId: string,
    commentId: string
  ) => `/api/meets/${meetUpId}/reviews/${reviewId}/comments/${commentId}/reply`,

  ANY_USE_USER: (page: string | undefined) =>
    page ? `/api/users/me/${page}` : `/api/users/me`,
};

export const enum ROUTE_PATH {
  ENTER = "/enter",
  INDEX = "/",
  COMMUNITY = "/community",
  CHAT = "/chats",
  LIVE = "/live",
  PROFILE = "/profile",
}

export const enum HTTPMESSAGE {
  "STATUS404" = "잘못된 접근입니다.",
  "STATUS500" = "알 수 없는 오류에의해 실패했습니다.",
}
