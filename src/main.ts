import {startTransition} from "./view/transitionScreen.ts";

document.getElementById('start-button')?.addEventListener('click', () => {
    startTransition(() => {
        window.location.href = '/public/game';
    });
});