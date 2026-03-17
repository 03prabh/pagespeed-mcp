const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

const API_KEY = process.env.API_KEY;

app.post("/mcp", async (req, res) => {
  const { method, params } = req.body;

  if (method === "tools/list") {
    return res.json({
      tools: [
        {
          name: "analyze_pagespeed",
          description: "Analyze website performance",
          inputSchema: {
            type: "object",
            properties: {
              url: { type: "string" }
            },
            required: ["url"]
          }
        }
      ]
    });
  }

  if (method === "tools/call") {
    const url = params.arguments.url;

    const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&key=${API_KEY}`;
    const response = await fetch(api);
    const data = await response.json();

    const score =
      data.lighthouseResult.categories.performance.score * 100;

    return res.json({
      content: [
        {
          type: "text",
          text: "Performance Score: " + score
        }
      ]
    });
  }

  res.status(400).send("Error");
});

app.listen(process.env.PORT || 3000);
