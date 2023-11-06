export const APIROUTE = {
  ENTER_LOGIN: "/api/users/existence",
  ENTER_PASSWORD: "/api/users/enter",
  ENTER_SIGNIN: "/api/users/available-test",
  ENTER_CREATION: "/api/users",

  ANY_USE_USER: (page: string | undefined) =>
    page ? `/api/users/me/${page}` : `/api/users/me`,
};

export const MEETS_API_ROUTE = {
  INDEX: "/api/meets",
  DETAIL: (meetUpId: string) => `/api/meets/${meetUpId}`,
  LIKE: (meetUpId: string) => `/api/meets/${meetUpId}/like`,
  JOIN: (meetUpId: string) => `/api/meets/${meetUpId}/join`,
  COMMENTS: (meetUpId: string) => `/api/meets/${meetUpId}/comments`,
  COMMENTS_EDIT: (meetUpId: string, commentId: string) =>
    `/api/meets/${meetUpId}/comments/${commentId}`,
  COMMENTS_LIKE: (meetUpId: string, commentId: string) =>
    `/api/meets/${meetUpId}/comments/${commentId}/like`,
  COMMENTS_REPLY: (meetUpId: string, commentId: string) =>
    `/api/meets/${meetUpId}/comments/${commentId}/reply`,

  REVIEWS: (meetUpId: string) => `/api/meets/${meetUpId}/reviews`,
  REVIEWS_INDEX: (meetUpId: string, reviewId: string) =>
    `/api/meets/${meetUpId}/reviews/${reviewId}`,
  REVIEWS_LIKE: (meetUpId: string, reviewId: string) =>
    `/api/meets/${meetUpId}/reviews/${reviewId}/like`,
};

export const COMMUNITY_API_ROUTE = {
  DETAIL: (postId: string) => `/api/tweets/${postId}`,

  COMMENTS: (postId: string) => `/api/tweets/${postId}/comments`,

  COMMENTS_EDIT: (postId: string, commentId: string) =>
    `/api/tweets/${postId}/comments/${commentId}`,

  COMMENTS_LIKE: (postId: string, commentId: string) =>
    `/api/tweets/${postId}/comments/${commentId}/like`,

  COMMENTS_REPLY: (postId: string, commentId: string) =>
    `/api/tweets/${postId}/comments/${commentId}/reply`,
};

export const REVIEWS_API_ROUTE = {
  DETAIL: (reviewId: string) => `/api/reviews/${reviewId}`,

  COMMENTS: (reviewId: string) => `/api/reviews/${reviewId}/comments`,
  COMMENTS_EDIT: (reviewId: string, commentId: string) =>
    `/api/reviews/${reviewId}/comments/${commentId}`,

  COMMENTS_INDEX: (reviewId: string, commentId: string) =>
    `/api/reviews/${reviewId}/comments/${commentId}`,

  COMMENTS_LIKE: (reviewId: string, commentId: string) =>
    `/api/reviews/${reviewId}/comments/${commentId}/like`,

  COMMENTS_REPLY: (reviewId: string, commentId: string) =>
    `/api//reviews/${reviewId}/comments/${commentId}/reply`,
};

export const enum ROUTE_PATH {
  ENTER = "/enter",
  INDEX = "/",
  TWEET = "/tweets",
  CHAT = "/chats",
  LIVE = "/live",
  PROFILE = "/profile",
}

export const enum HTTPMESSAGE {
  "STATUS404" = "잘못된 접근입니다.",
  "STATUS500" = "알 수 없는 오류에의해 실패했습니다.",
}
