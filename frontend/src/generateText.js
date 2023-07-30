// https://platform.openai.com/docs/quickstart/build-your-application
import { Configuration, OpenAIApi } from "openai";

const model = "gpt-3.5-turbo"; // models can be found at: https://platform.openai.com/docs/models
const temperature = 0.7; // From 0 to 1
const max_tokens = 2048;

const configuration = new Configuration({
  apiKey: "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",
  // apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function getText(input) {
  if (!input) {
    window.alert("Provide an input for OpenAI");
  }

  if (!configuration.apiKey) {
    window.alert("OpenAI API key not configured");
    return;
  }

  try {
    const completion = await openai.createChatCompletion({
      model: model,
      // prompt: generatePrompt(input),
      temperature: temperature,
      max_tokens: max_tokens,
      messages: getTextResult(input),
    });
    const response = completion.data.choices[0].message.content;
    console.log(response);
    return response;
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
    }
  }
}

function getTextResult(input) {
  const messages = [
    {
      role: "user",
      content: getTextPrompt(input),
    },
  ];
  return messages;
}

function getTextPrompt(input) {
  return `read the followings prompts for stable diffusion:

  Bobby George Foreman grill adorned with jewellery. professional product shot, magazine ad
  
  a high quality product photo ad of klaus nomi with a technical reed rollerball pen exacto knife by junji ito, uni - ball ethereal eel
  
  a pair of 9 0 s style designer sunglasses, vaporwave, highly reflective, product photo, award winning ad, pink backdrop, high quality, isometric, stylish, avant - garde, fuji film, artistic, photo realistic, dramatic lighting, luxury,
  
  McDonalds branded VR headset, product photo, ad, 4k
  
  an ad for mutagenic cereal, 1 9 9 6, product photography, hq
  
  franch sauce new sauce burger king, hd, product ad, 4 k
  
  a pair of aeon flux style designer sunglasses, product photo, award winning ad, high quality, isometric, stylish, avant - garde, fuji film, artistic, photo realistic, dramatic lighting, luxury.
  
  generate a quick 5 second ads speech based on the structure above for a ${input}
  
  Only use the qualities of the product described above.

  only give me the text that I should be saying`;
}
