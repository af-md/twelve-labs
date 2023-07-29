import React, { useState } from "react";
import Textarea from "@mui/joy/Textarea";
import Button from "@mui/joy/Button";
import Box from "@mui/joy/Box";
import { Send, HeadphonesOutlined } from "@mui/icons-material/";
import useSound from "use-sound";
import Typography from "@mui/material/Typography";

function App() {
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState("");
  const [query, setQuery] = useState("");
  const [audio, setAudio] = useState("");
  const [play] = useSound(audio);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const generateStory = () => {
    setLoading(true);
    console.log("story about: ", query);

    const apiKey = "befd5e8a8b03e48ea562a90a0c9f9155";
    const url =
      "https://api.elevenlabs.io/v1/text-to-speech/AonmwXR2V46c0iCvhQBe?optimize_streaming_latency=0";
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
    const headers = {
      accept: "audio/mpeg",
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
    };

    return fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestData),
    }).then((response) => {
      if (!response.ok) {
        console.error("Error fetching audio data:", response.statusText);
        return {
          props: {
            audioData: null,
          },
        };
      }
      if (response) {
        setStory(response);
      }
    });
  };

  const generateAudio = () => {
    setLoading(true);
    console.log("audio about: ", story);

    fetch(`http://127.0.0.1:8000/voice/${story}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Request failed");
        }
      })
      .then((data) => {
        console.log("audio path: ", data);
        if (data) {
          setAudio(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generateStory();
  };

  return (
    <Box
      sx={{
        marginTop: "32px",
        marginBottom: "32px",
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h5" component="h5">
        ElevenLabs Tutorial: Create stories with Voice AI from ElevenLabs
      </Typography>
      <Box sx={{ marginTop: "32px", width: "600px" }}>
        <form onSubmit={handleSubmit}>
          <Textarea
            sx={{ width: "100%" }}
            onChange={handleQueryChange}
            minRows={2}
            maxRows={4}
            placeholder="Type anything…"
          />
          <Button
            disabled={loading || query === ""}
            type="submit"
            sx={{ marginTop: "16px" }}
            loading={loading}
          >
            <Send />
          </Button>
        </form>
      </Box>
      {story && (
        <Box sx={{ marginTop: "32px", width: "600px" }}>
          <Textarea sx={{ width: "100%" }} value={story} />
          <Button
            loading={loading}
            sx={{ marginTop: "16px" }}
            onClick={audio ? play : generateAudio}
          >
            <HeadphonesOutlined />
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default App;
