import "dotenv/config";
import connectDB from "../../confiq/db.js";
import createEmbedding from "./embedding.js";
import PolicyChunk from "../../models/PolicyChunk.js";

async function searchPolicies(question) {

  await connectDB();

  const questionEmbedding = await createEmbedding(question);

  const results = await PolicyChunk.aggregate([
    {
      $vectorSearch: {
        index: "vector_index",
        path: "embedding",
        queryVector: questionEmbedding,
        numCandidates: 20,
        limit: 3
      }
    }
  ]);

  return results;   
}

export default searchPolicies;