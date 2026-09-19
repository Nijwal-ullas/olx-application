import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getProducts } from "../redux/slices/ProductSlice";
import ProductCard from "../components/ProductCard";
import AIChatbot from "../components/AIChatbot";
import { useSearchParams } from "react-router-dom";
import "../styles/Products.css";

function Products() {
  const { products, pagination, loading, error } = useSelector(
    (state) => state.products,
  );

  const dispatch = useDispatch();

  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sort = searchParams.get("sort") || "";
  const page = Number(searchParams.get("page")) || 1;

  const [showChat, setShowChat] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(category);
  const [minPriceInput, setMinPriceInput] = useState(minPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(maxPrice);
  const [selectedSort, setSelectedSort] = useState(sort);

  useEffect(() => {
    dispatch(
      getProducts({
        search: search || undefined,
        category: category || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        sort: sort || undefined,
        page,
      }),
    );
  }, [dispatch, search, category, minPrice, maxPrice, sort, page]);

  const handleApplyFilters = () => {
    const params = {};

    if (search) {
      params.search = search;
    }

    if (selectedCategory) {
      params.category = selectedCategory;
    }

    if (minPriceInput) {
      params.minPrice = minPriceInput;
    }

    if (maxPriceInput) {
      params.maxPrice = maxPriceInput;
    }

    if (selectedSort) {
      params.sort = selectedSort;
    }

    setSearchParams(params);
  };

  const handleClearFilters = () => {
    const params = {};

    if (search) {
      params.search = search;
    }

    setSelectedCategory("");
    setMinPriceInput("");
    setMaxPriceInput("");
    setSelectedSort("");

    setSearchParams(params);
  };

  if (loading) {
    return <h2>Loading products...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div className="products-page">
      <h1>Products</h1>

      <div className="products-layout">
        <aside className="filter-sidebar">
          <h3>Filters</h3>

          <div className="filter-group">
            <label>Category</label>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Mobiles">Mobiles</option>
              <option value="Laptops">Laptops</option>
              <option value="Cars">Cars</option>
              <option value="Bikes">Bikes</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Books">Books</option>
              <option value="Fashion">Fashion</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Minimum Price</label>

            <input
              type="number"
              placeholder="₹ Minimum"
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Maximum Price</label>

            <input
              type="number"
              placeholder="₹ Maximum"
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Sort By</label>

            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
            >
              <option value="">Default</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="price_new">Newest</option>
              <option value="price_old">Oldest</option>
            </select>
          </div>

          <button className="apply-filter-button" onClick={handleApplyFilters}>
            Apply Filters
          </button>

          <button className="clear-filter-button" onClick={handleClearFilters}>
            Clear Filters
          </button>
        </aside>

        <main className="products-content">
          <div className="products-header">
            <div>
              {search ? <h2>Results for "{search}"</h2> : <h2>All Products</h2>}

              <p>
                {products.length} product
                {products.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="no-products">
              <h2>No products found</h2>

              <p>
                {search
                  ? `No products match "${search}".`
                  : "Try changing your filters."}
              </p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => {
                setSearchParams({
                  ...Object.fromEntries(searchParams),
                  page: page - 1,
                });
              }}
            >
              Previous
            </button>

            <span>
              Page {pagination.currentPage} of {pagination.totalpages}
            </span>

            <button
              disabled={page === pagination.totalpages}
              onClick={() => {
                setSearchParams({
                  ...Object.fromEntries(searchParams),
                  page: page + 1,
                });
              }}
            >
              Next
            </button>
          </div>
        </main>
      </div>

      <button className="ai-chat-button" onClick={() => setShowChat(true)}>
        🤖
      </button>

      {showChat && <AIChatbot onClose={() => setShowChat(false)} />}
    </div>
  );
}

export default Products;
