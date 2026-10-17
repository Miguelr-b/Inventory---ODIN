const deleteDialog = document.getElementById("delete-dialog");
const deleteOpen = document.getElementById("delete-open");

if (deleteDialog && deleteOpen) {
    deleteOpen.addEventListener("click", () => deleteDialog.showModal());

    deleteDialog.querySelector("[data-close]").addEventListener("click", () => {
        deleteDialog.close();
    });
}