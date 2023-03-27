export const getDateFormatCreatedAt = (createdAt): string => {
    const dateStringToMilliseconds = Date.parse(createdAt);
    const date = new Date(dateStringToMilliseconds);
    const dateFormat = date.toLocaleDateString("en-US");
    return dateFormat;
  };