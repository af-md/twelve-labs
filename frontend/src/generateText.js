// https://platform.openai.com/docs/quickstart/build-your-application
import { Configuration, OpenAIApi } from "openai";

const model = "gpt-3.5-turbo"; // models can be found at: https://platform.openai.com/docs/models
const temperature = 0.7; // From 0 to 1
const max_tokens = 1000;

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
    
    internally generate a prompt based on the structure above for a ${input}
    and use that output to generate a 30 sec complete presentation  script of a user selling a product, with the promo you just generated for the shoes ad above. Make sure not to show the internally generated prompt to me
    
    Only use the qualities of the product described above. Only include the voice over text. Don't include "Absolutely, here's a 30-second presentation script based on the provided description:" and the following time logs in the result below ((0:00-0:05)).`;
}
