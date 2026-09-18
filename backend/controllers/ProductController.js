import Product from "../models/Products.js";
import uploadToCloudinary from "../services/cloudinaryService.js";

const createProduct = async (req, res) => {
  try {
    const { title, price, description, category, condition } = req.body;

    console.log("first");

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "One image is required",
      });
    }

    if (req.files.length > 5) {
      return res.status(400).json({
        message: "Max 5 images",
      });
    }

    const imageUrls = [];

    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer);
      imageUrls.push(result.secure_url);
    }
    console.log("second");

    const product = await Product.create({
      title,
      price,
      category,
      description,
      condition,
      images: imageUrls,
      seller: req.user.id,
    });

    console.log("third");

    res.status(201).json({
      message: "product added succesfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "failed to add product",
      error: error.message,
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
      sort,
    } = req.query;

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

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) {
        filter.price.$gt = Number(minPrice);
      }
      if (maxPrice) {
        filter.price.$lt = Number(maxPrice);
      }
    }

    let sortOption = {};

    if (sort === "price_asc") {
      sortOption.price = 1;
    }
    if (sort === "price_dec") {
      sortOption.price = -1;
    }
    if (sort === "price_new") {
      sortOption.createdAt = 1;
    }
    if (sort === "price_old") {
      sortOption.createdAt = -1;
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    const totalProducts = await Product.countDocuments(filter);
    const totalpages = Math.ceil(totalProducts / limitNumber);

    res.status(200).json({
      message: "successfully get all products",
      products,
      pagination: {
        currentPage: pageNumber,
        limit: limitNumber,
        totalProducts,
        totalpages,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "failed to get all product",
      error: error.message,
    });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "product not found",
      });
    }

    res.status(200).json({
      message: "product got successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "failed to get  product",
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to update this product",
      });
    }

    const { title, price, description, category, condition, existingImages } =
      req.body;

    product.title = title;
    product.price = price;
    product.description = description;
    product.category = category;
    product.condition = condition;

    let oldImages = [];

    if (existingImages) {
      oldImages = JSON.parse(existingImages);
    }

    const newFileCount = req.files?.length || 0;

    if (oldImages.length + newFileCount > 5) {
      return res.status(400).json({
        message: "Maximum 5 images are allowed",
      });
    }

    const newImageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer);

        newImageUrls.push(result.secure_url);
      }
    }

    product.images = [...oldImages, ...newImageUrls];

    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.log("UPDATE ERROR:", error);

    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "product not found",
      });
    }

    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to delete this product",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "failed to delete  product",
      error: error.message,
    });
  }
};

const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({
      seller: req.user.id,
    });

    res.status(200).json({
      message: "Your products fetched successfully",
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch your products",
      error: error.message,
    });
  }
};

export default {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
};
