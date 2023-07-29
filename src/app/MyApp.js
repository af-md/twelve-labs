"use client"; // This is a client component 
import React, { useEffect, useState } from 'react';
import { useClient } from 'next/client';

function MyApp() {
  useClient();

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "key": "QiUTvhf8SLDJMEMWhPozq2ctRxrMgtvpgF3EfbAJVatI1dSTvKWfEsFeugFC",
          "prompt": "ultra realistic close up portrait ((beautiful pale cyberpunk female with heavy black eyeliner))",
          "negative_prompt": null,
          "width": "512",
          "height": "512",
          "samples": "1",
          "num_inference_steps": "20",
          "seed": null,
          "guidance_scale": 7.5,
          "safety_checker": "yes",
          "multi_lingual": "no",
          "panorama": "no",
          "self_attention": "no",
          "upscale": "no",
          "embeddings_model": null,
          "webhook": null,
          "track_id": null
        })
      };
      
      const response = await fetch('https://stablediffusionapi.com/api/v3/text2img', requestOptions);
      const data = await response.json();

      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }

      setData(data);
    };

    fetchData();
  }, []);

  // Render your component with the data you fetched
  return (
    <div>
      {data && <div>{JSON.stringify(data)}</div>}
    </div>
  );
}

export default MyApp;
