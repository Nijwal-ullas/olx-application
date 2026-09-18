import mongoose from "mongoose";

const policyChunkSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },

    embedding: {
      type: [Number],
      required: true,
    },

    policy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const PolicyChunk = mongoose.model("PolicyChunk", policyChunkSchema);

export default PolicyChunk;
