export function createModal(title, desc) {
    if (document.getElementById("modal")) return;
    
    const modalBg = document.createElement("div");
    modalBg.id = "modal";
    modalBg.className = "modalBg";

    const modal = document.createElement("div");
    modal.className = "modal";

    const row = document.createElement("div");
    row.className = "row";

    const heading = document.createElement("h1");
    heading.innerText = title;

    const closeBtn = document.createElement("i");
    closeBtn.id = "modal-close-btn";
    closeBtn.className = "fa-solid fa-xmark";
    closeBtn.style.cursor = "pointer";

    // Close modal on button click
    closeBtn.addEventListener("click", () => {
        document.body.removeChild(modalBg);
    });

    row.appendChild(heading);
    row.appendChild(closeBtn);

    // Create content
    const content = document.createElement("div");
    content.className = "content";
    content.innerText = desc;

    modal.appendChild(row);
    modal.appendChild(content);
    modalBg.appendChild(modal);
    document.body.appendChild(modalBg);
}
