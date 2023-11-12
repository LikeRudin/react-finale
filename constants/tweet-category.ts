export const enum TweetCategory {
  RECOMMEND = "Recommend",
  QUESTION = "Question",
  CONVERSATION = "Conversation",
  FUN = "Fun",
  ETC = "ETC",
}

export const CreateImagePath = (imagePath: string) =>
  `https://imagedelivery.net/f_vDOY5X8q6G-fojXO70Ng/${imagePath}/public`;
