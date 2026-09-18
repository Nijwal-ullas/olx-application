import express  from "express";
import cors from "cors";
import mongoDB from "./confiq/db.js";
import ProductRoutes from "./routes/ProductRoutes.js";
import UserRoutes from "./routes/UserRoutes.js";
import AIRoutes from "./routes/AIRoutes.js";


const app = express();

app.use(cors());
app.use(express.json());

mongoDB();
const port = process.env.PORT;

app.use("/products",ProductRoutes);
app.use("/",UserRoutes);
app.use("/ai",AIRoutes);

app.listen(port, () => {
  console.log("Server running ");
});
