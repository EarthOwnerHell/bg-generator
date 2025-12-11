const express = require("express");
const cors = require("cors");
const path = require("path");
const colorRoutes = require("./routes/colorRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// middleware для логов
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
  next();
});

app.use(express.static(path.join(__dirname, "public")));
app.use("/api", colorRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Маршрут не найден" });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
