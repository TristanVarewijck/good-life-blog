const { Configuration, OpenAIApi } = require("openai");
// import { executeOpenAiProps } from "../../types";

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);

export const executeTextGeneration = async ({prompt, max_tokens, temperature, n}) => {
    const contentCompletion = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: prompt,
        max_tokens: max_tokens,
        temperature: temperature,
        n: n,
      });

      return contentCompletion;
}

export const executeImageGeneration = async ({ prompt, imageSize}) => {
    const contentCompletion = await openai.createImage({
        prompt: prompt,
        n: 1,
        size: imageSize
      });

      return contentCompletion;
}

