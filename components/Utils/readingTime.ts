export const getAverageReadingTime  = (content): number => {
    const text = content;
    const wpm = 225;
    const words = text.trim().split(/\s+/).length;
    const readingTimeInMinutes = Math.ceil(words / wpm);
    return readingTimeInMinutes

}