let savedColors = [];
let nextId = 1;

const generateRandomHex = () => {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
};

exports.generateColor = (req, res) => {
  const hex = generateRandomHex();
  res.json({
    color: hex,
    message: "Цвет успешно сгенерирован",
    timestamp: new Date().toISOString(),
  });
};

exports.getSavedColors = (req, res) => {
  res.json({
    savedColors,
    count: savedColors.length,
  });
};

exports.saveColor = (req, res) => {
  const { color, name } = req.body;

  if (!color) {
    return res.status(400).json({ error: 'Поле "color" обязательно' });
  }

  const newColor = {
    id: nextId++,
    color,
    name: name || "Без названия",
    savedAt: new Date().toISOString(),
  };

  savedColors.push(newColor);
  res.status(201).json({
    message: "Цвет сохранён",
    savedColor: newColor,
  });
};

exports.deleteColor = (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = savedColors.length;

  savedColors = savedColors.filter((c) => c.id !== id);

  if (savedColors.length < initialLength) {
    res.json({ message: `Цвет с ID ${id} удалён` });
  } else {
    res.status(404).json({ error: "Цвет не найден" });
  }
};
