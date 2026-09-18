import "dotenv/config";
import fs from "fs/promises";
import PolicyChunk from "../../models/PolicyChunk.js";
import connectDB from "../../confiq/db.js";

import { chunkText } from "./chunker.js";
import createEmbedding from "./embedding.js";


async function ingestPolicies() {
    await connectDB();  

  const text = await fs.readFile(
    "./Policies/marketPolicies.txt",
    "utf-8"
  );

  const chunks = chunkText(text);

  for (const chunk of chunks) {
    const embedding = await createEmbedding(chunk);
    const policy = chunk.match(/^## \d+\.\s*(.*)/)?.[1];

    await PolicyChunk.create({
      text: chunk,
      embedding: embedding,
      policy: policy,
    });
  }
}


ingestPolicies();