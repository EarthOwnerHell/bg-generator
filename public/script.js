document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const colorBox = document.getElementById("colorBox");
  const hexValue = document.getElementById("hexValue");
  const generateBtn = document.getElementById("generateBtn");
  const saveBtn = document.getElementById("saveBtn");
  const saveForm = document.getElementById("saveForm");
  const colorNameInput = document.getElementById("colorName");
  const confirmSaveBtn = document.getElementById("confirmSave");
  const cancelSaveBtn = document.getElementById("cancelSave");
  const colorsList = document.getElementById("colorsList");

  let currentColor = "#FFFFFF";
  generateBtn.addEventListener("click", async () => {
    try {
      const response = await fetch("/api/color");
      const data = await response.json();
      currentColor = data.color;
      updateDisplay();
    } catch {
      // генерация локально при ошибке
      currentColor =
        "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0");
      updateDisplay();
    }
  });

  // показать форму сохранения
  saveBtn.addEventListener("click", () => {
    saveForm.style.display = "block";
    colorNameInput.focus();
  });

  // отмена
  cancelSaveBtn.addEventListener("click", () => {
    saveForm.style.display = "none";
    colorNameInput.value = "";
  });

  confirmSaveBtn.addEventListener("click", async () => {
    const name = colorNameInput.value.trim() || "Без названия";

    try {
      const response = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ color: currentColor, name }),
      });

      if (response.ok) {
        saveForm.style.display = "none";
        colorNameInput.value = "";
        loadSavedColors();
      }
    } catch {
      alert("Ошибка сохранения");
    }
  });

  // обновляем отображениее
  function updateDisplay() {
    body.style.backgroundColor = currentColor;
    colorBox.style.backgroundColor = currentColor;
    hexValue.textContent = currentColor;
  }

  // загрузка сохр цветов
  async function loadSavedColors() {
    try {
      const response = await fetch("/api/saved");
      const data = await response.json();

      if (data.savedColors.length === 0) {
        colorsList.innerHTML = "<p>Нет сохраненных цветов</p>";
        return;
      }

      colorsList.innerHTML = "";

      data.savedColors.forEach((color) => {
        const div = document.createElement("div");
        div.className = "saved-color";
        div.innerHTML = `
                    <div class="saved-color-box" style="background-color: ${color.color}"></div>
                    <div class="saved-color-name">${color.name}</div>
                    <button class="delete-btn" data-id="${color.id}">Удалить</button>
                `;

        // клик по кнопке устанавливает bg на этот цвет
        div.querySelector(".saved-color-box").addEventListener("click", () => {
          currentColor = color.color;
          updateDisplay();
        });

        // удаление цвета
        div
          .querySelector(".delete-btn")
          .addEventListener("click", async (e) => {
            e.stopPropagation();
            const id = e.target.dataset.id;
            await fetch(`/api/saved/${id}`, { method: "DELETE" });
            loadSavedColors();
          });

        colorsList.appendChild(div);
      });
    } catch {
      colorsList.innerHTML = "<p>Ошибка загрузки</p>";
    }
  }

  generateBtn.click(); // генерация первого цвета
  loadSavedColors(); //загрузка сохраненных цветов
});
