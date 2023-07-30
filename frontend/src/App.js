import React, { useState } from "react";
import Textarea from "@mui/joy/Textarea";
import Button from "@mui/joy/Button";
import Box from "@mui/joy/Box";
import { Send, HeadphonesOutlined } from "@mui/icons-material/";
import useSound from "use-sound";
import Typography from "@mui/material/Typography";
import mp3File from "./audios/sound.mp3";
import getText from "./generateText";
import CircularProgress from "@mui/material/CircularProgress";

function App() {
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState("");
  const [audio, setAudio] = useState("");
  const [play] = useSound(mp3File);

  const handleQueryChange = (e) => {
    console.log(e.target.value);
    setStory(e.target.value);
  };

  const generateImage = async () => {
    fetch(`http://127.0.0.1:8000/image/water`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const generateAudio = async () => {
    setLoading(true);
    const image = await generateImage();
    const text = await getText(story);

    console.log("audio about: ", text);

    fetch(`http://127.0.0.1:8000/voice/${text}`, {
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
    generateAudio();
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
        <Textarea
          sx={{ width: "100%" }}
          onChange={handleQueryChange}
          minRows={2}
          maxRows={4}
          placeholder="Type anything…"
        />
        <Button sx={{ marginTop: "16px" }} onClick={handleSubmit}>
          <Send />
        </Button>
      </Box>
      {loading && <CircularProgress sx={{ marginTop: "16px" }} />}
      <Button
        sx={{ marginTop: "16px" }}
        onClick={() => {
          play();
          console.log(mp3File);
        }}
      >
        <HeadphonesOutlined />
      </Button>
    </Box>
  );
}

export default App;
