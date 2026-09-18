export async function getMarketPrice(product) {
  try {
    const query = `${product.title} ${product.condition} used price India`;

    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": process.env.SERPER_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: query,
        gl: "in",
        hl: "en",
        num: 10,
      }),
    });

    if (!response.ok) {
      throw new Error(`Serper API error: ${response.status}`);
    }

    const data = await response.json();

    return data;

  } catch (error) {
    console.error("Market price tool error:", error);

    return null;
  }
}