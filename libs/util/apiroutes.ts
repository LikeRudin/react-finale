export const APIROUTE = {
  ENTER_LOGIN: "/api/users/existence",
  ENTER_PASSWORD: "/api/users/enter",
  ENTER_SIGNIN: "/api/users/available-test",
  ENTER_CREATION: "/api/users",
};

export const MEETS_API_ROUTE = {
  INDEX: "/api/meets",
  DETAIL: (meetUpId: string | number) => `/api/meets/${meetUpId}`,
  LIKE: (meetUpId: string | number) => `/api/meets/${meetUpId}/like`,
  JOIN: (meetUpId: string | number) => `/api/meets/${meetUpId}/join`,
  COMMENTS: (meetUpId: string | number) => `/api/meets/${meetUpId}/comments`,
  COMMENTS_EDIT: (meetUpId: string | number, commentId: string | number) =>
    `/api/meets/${meetUpId}/comments/${commentId}`,
  COMMENTS_LIKE: (meetUpId: string | number, commentId: string | number) =>
    `/api/meets/${meetUpId}/comments/${commentId}/like`,
  COMMENTS_REPLY: (meetUpId: string | number, commentId: string | number) =>
    `/api/meets/${meetUpId}/comments/${commentId}/reply`,

  REVIEWS: (meetUpId: string | number) => `/api/meets/${meetUpId}/reviews`,
  REVIEWS_INDEX: (meetUpId: string | number, reviewId: string | number) =>
    `/api/meets/${meetUpId}/reviews/${reviewId}`,
  REVIEWS_LIKE: (meetUpId: string | number, reviewId: string | number) =>
    `/api/meets/${meetUpId}/reviews/${reviewId}/like`,
};

export const TWEETS_API_ROUTE = {
  INDEX: `/api/tweets`,
  DETAIL: (postId: string | number) => `/api/tweets/${postId}`,
  COMMENTS: (postId: string | number) => `/api/tweets/${postId}/comments`,
  LIKE: (postId: string | number) => `/api/tweets/${postId}/like`,

  COMMENTS_EDIT: (postId: string | number, commentId: string | number) =>
    `/api/tweets/${postId}/comments/${commentId}`,

  COMMENTS_LIKE: (postId: string | number, commentId: string | number) =>
    `/api/tweets/${postId}/comments/${commentId}/like`,

  COMMENTS_REPLY: (postId: string | number, commentId: string | number) =>
    `/api/tweets/${postId}/comments/${commentId}/reply`,
};

export const REVIEWS_API_ROUTE = {
  DETAIL: (reviewId: string | number) => `/api/reviews/${reviewId}`,

  COMMENTS: (reviewId: string | number) => `/api/reviews/${reviewId}/comments`,
  COMMENTS_EDIT: (reviewId: string | number, commentId: string | number) =>
    `/api/reviews/${reviewId}/comments/${commentId}`,

  COMMENTS_INDEX: (reviewId: string | number, commentId: string | number) =>
    `/api/reviews/${reviewId}/comments/${commentId}`,

  COMMENTS_LIKE: (reviewId: string | number, commentId: string | number) =>
    `/api/reviews/${reviewId}/comments/${commentId}/like`,

  COMMENTS_REPLY: (reviewId: string | number, commentId: string | number) =>
    `/api//reviews/${reviewId}/comments/${commentId}/reply`,
};

export const PROFILE_API_ROUTE = {
  ME: "/api/users/me/profile",
  EDIT: "/api/users/me",
  OTHERS: (userId: string | number) => `/api/users/${userId}`,
};

export const enum ROUTE_PATH {
  ENTER = "/enter",
  INDEX = "/",
  TWEET = "/tweets",
  CHAT = "/chats",
  LIVE = "/live",
  PROFILE = "/profile",
}

export const HTTPMESSAGE = {
  STATUS404: (message: string | number | undefined) =>
    `잘못된 접근입니다. ${message}`,
  STATUS500: (message: string | number | undefined) =>
    `알 수 없는 오류에의해 실패했습니다. ${message}`,
};
