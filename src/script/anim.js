document.getElementById("inputBox").addEventListener("click", function() {
    this.classList.add("vibrating");
    setTimeout(() => {
        this.classList.remove("vibrating");
    }, 600);
});