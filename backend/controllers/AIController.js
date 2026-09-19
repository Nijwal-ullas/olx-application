import { GoogleGenAI } from "@google/genai";
import Product from "../models/Products.js";
import { searchProducts } from "../tools/productTools.js";
import { getMarketPrice } from "../tools/marketPriceTool.js";
import validate from "../tools/validateResult.js";
import searchPolicies from "../services/Rag/searchPolicies.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateDescription(req, res) {
  try {
    const { title, price, category, condition } = req.body;

    if (!title || !price || !category || !condition) {
      return res.status(400).json({
        message: "Title, Price, condition and category are required...",
      });
    }

    const prompt = `
        You are an AI assistant for an OLX-like marketplace.

        Your task is to write a short, clear, and attractive product description based ONLY on the information provided by the user.

        Product information:

        * Title: ${title}
        * Category: ${category}
        * Price: ₹${price}
        * Condition: ${condition}

        Rules:

        1. Keep the description concise and suitable for an online marketplace.
        2. Use only the information provided above.
        3. Do NOT invent specifications, features, accessories, warranty, purchase date, or other details.
        4. Do NOT assume information that is not provided.
        5. Mention the product condition naturally if it is provided.
        6. Do not unnecessarily repeat the price.
        7. Use simple and buyer-friendly language.
        8. Do not use emojis.
        9. Return ONLY the product description.
        10. Do not include headings, explanations, quotation marks, or markdown.

        Example style:
        "Samsung Galaxy S22 Ultra in good condition. A suitable choice for anyone looking for this model in the used mobile market."
        `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const description = response.text;

    return res.status(200).json({
      message: "Description generated successfully",
      description,
    });
  } catch (error) {
    console.log("Gemini error:", error);

    return res.status(500).json({
      message: "Failed to generate description",
      error: error.message,
    });
  }
}

async function understandSearch(req, res) {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        message: "search query requiered",
      });
    }

    const prompt = `
        You are a search assistant for an OLX-like marketplace.

        Convert the user's search query into structured search filters.

        User query:
        "${query}"

        Return ONLY valid JSON in this format:

        {
          "search": "",
          "category": "",
          "minPrice": null,
          "maxPrice": null,
          "sort": null
        }

        Rules:
        - search should contain the main product keyword.
        - category should be one of:
          Mobiles, Electronics, Vehicles, Furniture, Fashion,
          Books, Sports, Real Estate, Jobs, Others
        - minPrice should be a number or null.
        - maxPrice should be a number or null.
        - sort should be "price_asc", "price_desc", or null.
        - Do not invent information.
        `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const text = response.text;

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const filters = JSON.parse(cleanedText);

    res.status(200).json({
      message: "Search understood successfully",
      filters,
    });
  } catch (error) {
    console.log("AI SEARCH ERROR:", error);

    if (error.status === 429) {
      return res.status(429).json({
        message: "AI search limit reached. Please try again later.",
      });
    }

    return res.status(500).json({
      message: "AI search failed",
      error: error.message,
    });
  }
}

async function productAssistant(req, res) {
  try {
    const { productId, question } = req.body;
    if (!productId || !question) {
      return res.status(400).json({
        message: "product id and Question are required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(400).json({
        messsage: "product not found",
      });
    }

    const prompt = `
          You are an AI product assistant for an OLX-like marketplace.

          Answer the user's question using ONLY the information
          available about the product.

          Product information:
          Title: ${product.title}
          Price: ₹${product.price}
          Category: ${product.category}
          condition: ${product.condition}
          Description: ${product.description || "No description provided"}

          User question:
          ${question}

          Rules:
          - Give a short and helpful answer.
          - Do not invent product specifications.
          - Do not assume information that is not provided.
          - If the information is not available, clearly say that
            the listing does not provide that information.
        `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const answer = response.text;

    return res.status(200).json({
      message: "response successfully",
      answer,
    });
  } catch (error) {
    if (error.status === 429) {
      return res.status(429).json({
        message: "AI limit reached. Please try again later.",
      });
    }

    return res.status(500).json({
      message: "Product assistant failed",
      error: error.message,
    });
  }
}

async function mockAssistance(req, res) {
  try {
    const { question } = req.body;

    const prompt = `
      You are an AI product assistant for an OLX-like marketplace.

      Answer the user's question.

      User question:
      ${question}

      Rules:
      - Give a short and helpful answer.
      
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const answer = response.text;

    return res.status(200).json({
      message: "response successfully",
      answer,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "AI response failed",
      error: error.message,
    });
  }
}

async function rag(req, res) {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        message: "question is needed",
      });
    }

    const searchResult = await searchPolicies(question);

    const context = searchResult.map((result) => result.text).join("\n\n");

    const prompt = `
        You are an AI assistant for an OLX-like marketplace.

        Answer the user's question using only the policy context provided below.

        Policy Context:
        ${context}

        User Question:
        ${question}

        Rules:
        - Give a clear and helpful answer.
        - Do not invent information.
        - If the answer is not available in the policy context, say so.
        `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const answer = response.text;

    return res.status(200).json({
      message: "Response successfully",
      answer,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

async function chatWithAI(req, res) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const prompt = `
      You are an AI assistant for an OLX-like marketplace.

      Analyze the user's message and decide whether they want
      to search for products.

      Return ONLY valid JSON.

      Format:

      {
        "action": "search_products" or "chat",
        "search": "",
        "category": "",
        "minPrice": null,
        "maxPrice": null
      }

      User message:
      ${message}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const text = response.text;

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const decision = JSON.parse(cleanedText);

    if (decision.action === "search_products") {
      const products = await searchProducts({
        search: decision.search,
        category: decision.category,
        minPrice: decision.minPrice,
        maxPrice: decision.maxPrice,
      });

      const finalPrompt = `
        You are an OLX marketplace assistant.

        The user asked:
        "${message}"

        Database results:
        ${JSON.stringify(products)}

        Respond concisely.

        Rules:
        - Only use information from the database results.
        - Never invent products or specifications.
        - Show every product as a bullet point.
        - For each product show:
          • Title
          • Price
          • Category
        - Do not use a table.
        - If there are no results, say that no matching products were found.

        Format:

        Here are the matching products:

        • Product Title
          Price: ₹Price
          Category: Category
      `;
      const finalResponse = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: finalPrompt,
      });

      const answer = finalResponse.text;

      return res.status(200).json({
        message: "Response successfully",
        answer,
        products,
      });
    }

    const chatPrompt = `
      You are an AI assistant for an OLX-like marketplace.

      Help users with:
      - Buying products
      - Selling products
      - Understanding marketplace features
      - General questions about buying and selling

      Be helpful and concise.

      User message:
      ${message}
    `;

    const chatResponse = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: chatPrompt,
    });

    const answer = chatResponse.text;

    return res.status(200).json({
      message: "Response successfully",
      answer,
    });
  } catch (error) {
    console.log("CHAT ERROR:", error);

    return res.status(500).json({
      message: "AI assistant failed",
      error: error.message,
    });
  }
}

async function productSell(req, res) {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({
        message: "message need",
      });
    }

    let prompt = `You are a product information extraction assistant for an OLX-style marketplace.
    
            Extract product information from the user's message.

            Return ONLY valid JSON. Do not include markdown, explanations, or additional text.

            The JSON must have exactly these fields:

            {
              "title": "string",
              "price": number,
              "category": "Mobiles | Laptops | Cars | Bikes | Electronics | Furniture | Books | Fashion | Other",
              "condition": "New | Like New | Good | Fair | Used",
              "description": "string"
            }

            Rules:
            1. Extract only information that is present in the user's message.
            2. Do not invent missing information.
            3. If the price is mentioned with ₹, convert it to a number.
            4. Keep the description concise and based only on the user's message.
            5. Choose the closest condition from the allowed values.
            6. If a required field is missing, set its value to null.
            7. Return only the JSON object.
            8. Category must be exactly one of the allowed categories.
            9. Choose the closest matching category.
            10. If the product does not clearly match any category, use "Other".

            User message:
            ${message}`;

    const result = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = result.text;

    const productData = JSON.parse(text);

    const marketData = await getMarketPrice(productData);

    const listingPrompt = `
        You are an OLX listing assistant.

        Create a professional product listing using the product information
        and market price information provided below.

        Product information:
        ${JSON.stringify(productData)}

        Market price information:
        ${JSON.stringify(marketData)}

        Return ONLY valid JSON.

        Return exactly these fields:

        {
          "title": "string",
          "description": "string",
          "category": "string",
          "condition": "string",
          "suggestedPrice": number
        }

        Rules:
        1. Create a clear and attractive title.
        2. Write a concise and honest description.
        3. Use the provided product information only.
        4. Use the market price information to suggest a reasonable selling price.
        5. Do not claim that the market data is real-time unless explicitly provided as real-time.
        6. Do not invent product specifications.
        7. Return only valid JSON.
        `;

    const finalResult = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: listingPrompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const answer = finalResult.text;

    const finalAnswer = JSON.parse(answer);

    const validation = validate(finalAnswer);

    if (!validation.valid) {
      return res.status(422).json({
        message: "AI generated an invalid listing",
        errors: validation.error,
      });
    }

    return res.status(200).json({
      finalAnswer,
    });
  } catch (error) {
    console.error("PRODUCT SELL ERROR:", error);

    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}

export default {
  generateDescription,
  understandSearch,
  productAssistant,
  mockAssistance,
  chatWithAI,
  productSell,
  rag,
};
