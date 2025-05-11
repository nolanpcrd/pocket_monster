export function startTransition(
    callback?: () => void,
    duration: number = 1000,
    backgroundColor: string = "#9089F4"
): void {
  const transitionContainer = document.createElement("div");
  transitionContainer.className = "transition-container";

  const loadingText = document.createElement("div");
  loadingText.className = "loading-text";
  loadingText.textContent = "Loading...";

  const eggContainer = document.createElement("div");
  eggContainer.className = "egg-container";

  for (let i = 0; i < 15; i++) {
    const egg = document.createElement("div");
    egg.className = "egg";
    eggContainer.appendChild(egg);
  }

  const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = "/public/transition.css";
    style.type = "text/css";
    style.onload = () => {
        transitionContainer.style.backgroundColor = backgroundColor;
    }
    document.head.appendChild(style);

  document.head.appendChild(style);
  transitionContainer.appendChild(loadingText);
  transitionContainer.appendChild(eggContainer);
  document.body.appendChild(transitionContainer);

  void transitionContainer.offsetWidth;

  transitionContainer.classList.add("active");

  const eggs = document.querySelectorAll('.egg');
  eggs.forEach((egg, index) => {
    setTimeout(() => {
      (egg as HTMLElement).style.animation = `pulse 1s ease-in-out infinite ${index * 0.1}s`;
    }, 50);
  });

  setTimeout(() => {
    if (callback) callback();

    transitionContainer.classList.add("fade-out");

    setTimeout(() => {
      document.body.removeChild(transitionContainer);
      document.head.removeChild(style);
    }, 500);

  }, duration);
}