function chunkText(text) {
  const chunks = text
    .split(/(?=## \d+\.)/)
    .map(chunk => chunk.trim())
    .filter(chunk => chunk.length > 0);

  return chunks;
}

export { chunkText };