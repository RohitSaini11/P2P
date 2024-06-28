document.addEventListener("DOMContentLoaded", function () {
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const fileList = document.getElementById("fileList");
  const MAX_IMAGES = 5;

  // Load images from local storage on page load
  loadFromLocalStorage();

  dropzone.addEventListener("dragover", function (e) {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });

  dropzone.addEventListener("dragleave", function () {
    dropzone.classList.remove("dragover");
  });

  dropzone.addEventListener("drop", function (e) {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    handleFiles(e.dataTransfer.files);
  });

  dropzone.addEventListener("click", function () {
    fileInput.click();
  });

  fileInput.addEventListener("change", function () {
    handleFiles(fileInput.files);
  });

  function handleFiles(files) {
    if (fileList.childElementCount + files.length > MAX_IMAGES) {
      alert("You can upload a maximum of 5 images.");
      return;
    }
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        alert("Only images are allowed.");
        return;
      }
      if (file.size > 1024 * 1024) {
        alert("Images must be smaller than 1 MB.");
        return;
      }
      displayFile(file);
    });
  }

  function displayFile(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const div = document.createElement("div");
      div.className = "file-item";

      const img = document.createElement("img");
      img.src = e.target.result;
      img.alt = file.name;
      img.className = "thumbnail";
      div.appendChild(img);

      const textarea = document.createElement("textarea");
      div.appendChild(textarea);

      const actions = document.createElement("div");
      actions.className = "actions";
      div.appendChild(actions);

      const checkButton = document.createElement("button");
      checkButton.textContent = "✔️";
      checkButton.addEventListener("click", () => {
        alert("Description has been added.");
        textarea.disabled = true;
        saveToLocalStorage();
      });
      actions.appendChild(checkButton);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "❌";
      deleteButton.addEventListener("click", () => {
        fileList.removeChild(div);
        saveToLocalStorage();
      });
      actions.appendChild(deleteButton);

      fileList.appendChild(div);

      saveToLocalStorage();
    };

    reader.readAsDataURL(file);
  }

  function saveToLocalStorage() {
    const storedImagesData = [];
    document.querySelectorAll(".file-item").forEach((div) => {
      const img = div.querySelector("img");
      const textarea = div.querySelector("textarea");
      storedImagesData.push({
        src: img.src,
        description: textarea.value,
      });
    });
    localStorage.setItem("storedImagesData", JSON.stringify(storedImagesData));
  }

  function loadFromLocalStorage() {
    const storedImagesData = JSON.parse(
      localStorage.getItem("storedImagesData") || "[]"
    );
    console.log("Loaded from localStorage:", storedImagesData);
    storedImagesData.forEach((data) => {
      const div = document.createElement("div");
      div.className = "file-item";

      const img = document.createElement("img");
      img.src = data.src;
      img.className = "thumbnail";
      div.appendChild(img);

      const textarea = document.createElement("textarea");
      textarea.value = data.description;
      div.appendChild(textarea);

      const actions = document.createElement("div");
      actions.className = "actions";
      div.appendChild(actions);

      const checkButton = document.createElement("button");
      checkButton.textContent = "✔️";
      checkButton.addEventListener("click", () => {
        alert("Description has been added.");
        textarea.disabled = true;
        saveToLocalStorage();
      });
      actions.appendChild(checkButton);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "❌";
      deleteButton.addEventListener("click", () => {
        fileList.removeChild(div);
        saveToLocalStorage();
      });
      actions.appendChild(deleteButton);

      if (data.description) {
        textarea.disabled = true;
      }

      fileList.appendChild(div);
    });
  }
});
