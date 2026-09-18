import Product from "../models/Products.js  ";

export async function searchProducts({ search, category, minPrice, maxPrice }) {
  const filter = {};

  if (search) {
    filter.title = {
      $regex: search,
      $options: "i",
    };
  }

  if (category) {
    filter.category = category;
  }

  if (minPrice !== undefined && minPrice !== null) {
    filter.price = {
      ...filter.price,
      $gte: Number(minPrice),
    };
  }

  if (maxPrice !== undefined && maxPrice !== null) {
    filter.price = {
      ...filter.price,
      $lte: Number(maxPrice),
    };
  }

  const products = await Product.find(filter)
    .limit(4)
    .select("title price category description images");

  return products;
}
