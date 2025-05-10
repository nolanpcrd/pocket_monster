import { login, register, saveToken } from '../dao/auth';

let action: 'signin' | 'signup' = 'signin';

document.getElementById('signIn')?.addEventListener('click', function() {
    const toggleBtn = document.querySelector('.toggle-btn') as HTMLElement;
    const submitBtn = document.getElementById('submitBtn') as HTMLElement;
    const signIn = document.getElementById('signIn') as HTMLElement;
    const signUp = document.getElementById('signUp') as HTMLElement;
    const nameInput = document.getElementById('name') as HTMLInputElement;
    const nameLabel = document.getElementById('nameLabel') as HTMLElement;

    toggleBtn.style.left = '0';
    submitBtn.innerText = "Login";
    signIn.style.color = 'black';
    signUp.style.color = 'white';
    nameInput.style.display = 'none';
    nameInput.removeAttribute('required');
    nameLabel.style.display = 'none';
    action = 'signin';
});

document.getElementById('signUp')?.addEventListener('click', function() {
    const toggleBtn = document.querySelector('.toggle-btn') as HTMLElement;
    const submitBtn = document.getElementById('submitBtn') as HTMLElement;
    const signIn = document.getElementById('signIn') as HTMLElement;
    const signUp = document.getElementById('signUp') as HTMLElement;
    const nameInput = document.getElementById('name') as HTMLInputElement;
    const nameLabel = document.getElementById('nameLabel') as HTMLElement;

    toggleBtn.style.left = '50%';
    submitBtn.innerText = "Register";
    signUp.style.color = 'black';
    signIn.style.color = 'white';
    nameInput.style.display = 'block';
    nameInput.setAttribute('required', '');
    nameLabel.style.display = 'block';
    action = 'signup';
});

document.getElementById('authForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    try {
        let token: string;

        if (action === 'signin') {
            token = await login({ email, password });
        } else {
            const username = (document.getElementById('name') as HTMLInputElement).value;
            token = await register({ username, email, password });
        }

        saveToken(token);
        window.location.href = '/';

    } catch (error) {
        console.error('Erreur:', error);
        alert(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
});