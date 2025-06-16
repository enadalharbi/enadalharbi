
document.querySelectorAll(".menu button").forEach(button => {
  button.addEventListener("click", () => {
    const sound = document.getElementById("clickSound");
    sound.currentTime = 0;
    sound.play();

    const targetId = button.getAttribute("data-target");
    document.querySelectorAll(".screen").forEach(screen => {
      screen.classList.remove("active");
    });
    document.getElementById(targetId).classList.add("active");
  });
});
