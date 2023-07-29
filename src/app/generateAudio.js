const axios = require("axios");

export default async function getAudio() {
  const apiKey = "befd5e8a8b03e48ea562a90a0c9f9155";
  const url =
    "https://api.elevenlabs.io/v1/text-to-speech/AonmwXR2V46c0iCvhQBe?optimize_streaming_latency=0";
  const headers = {
    accept: "audio/mpeg",
    "xi-api-key": apiKey,
    "Content-Type": "application/json",
  };

  const requestData = {
    text: "Experience the ultimate in coffee indulgence with Costa Coffee's iconic cups, carefully crafted to preserve the rich aroma and exceptional flavor of our freshly brewed coffee. Sip your way to pure delight and elevate your daily coffee ritual with our beautifully designed, eco-friendly cups, bringing you a taste of luxury in every single sip!",
    model_id: "eleven_monolingual_v1",
    voice_settings: {
      stability: 0,
      similarity_boost: 0,
      style: 0.5,
      use_speaker_boost: true,
    },
  };

  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, { headers })
      .then((response) => {
        // Handle the response, for example, save the audio file.
        console.log("Audiooo generated");
        resolve(response.data);
      })
      .catch((error) => {
        // Handle errors if any.
        console.error("Error:", error);
        reject(error);
      });
  });
}
