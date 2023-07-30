// https://platform.openai.com/docs/quickstart/build-your-application
import { Configuration, OpenAIApi } from "openai";

const model = "gpt-3.5-turbo"; // models can be found at: https://platform.openai.com/docs/models
const temperature = 0.7; // From 0 to 1
const max_tokens = 2048;

const configuration = new Configuration({
  apiKey: "api-key",
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
  return `Generate a quick 50 words ads speech about ${input}. Only use the qualities of the product described above. Only give me the text that I should be saying. Don't add emoji.`;
}
