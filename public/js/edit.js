const urlInput = document.getElementById("image_url");
const preview = document.getElementById("image-preview");
const placeholder = document.getElementById("image-placeholder");

function showPlaceholder(text) {
    preview.hidden = true;
    preview.removeAttribute("src");
    placeholder.textContent = text;
    placeholder.hidden = false;
}

urlInput.addEventListener("change", () => {
    const url = urlInput.value.trim();

    if (!url) {
        showPlaceholder("No image");
        return;
    }

    preview.src = url;
    preview.hidden = false;
    placeholder.hidden = true;
});

preview.addEventListener("error", () => showPlaceholder("Could not load image"));