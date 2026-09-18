function    validate(data) {
  const error = [];
  if (!data.title || typeof data.title !== "string") {
    error.push("title is required");
  }
  if (!data.description || typeof data.description !== "string") {
    error.push("description is required");
  }
  const allowedCategories = [
    "Mobiles",
    "Laptops",
    "Cars",
    "Bikes",
    "Electronics",
    "Furniture",
    "Books",
    "Fashion",
    "Other",
  ];
  if (!allowedCategories.includes(data.category)) {
    error.push("invalid category");
  }
  const allowedConditions = ["New", "Like New", "Good", "Fair", "Used"];
  if (!allowedConditions.includes(data.condition)) {
    error.push("invalid condition");
  }
  if (typeof data.suggestedPrice !== "number" || data.suggestedPrice <= 0) {
    error.push("invalid price");
  }
  return {
    valid: error.length === 0,
    error,
  };
}

export default validate;
