export const tweetCategoryParser = (category: string) => {
  switch (category) {
    case "Recommend":
      return "추천해요";
    case "Question":
      return "궁금해요";
    case "Conversation":
      return "의논해요";
    case "Fun":
      return "재밌어요";
    case "ETC":
      return "잡담해요";
    default:
      return "이게뭐죠";
  }
};
