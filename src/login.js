let action = 'signin';

document.getElementById('signIn').addEventListener('click', function() {
    document.querySelector('.toggle-btn').style.left = '0';
    document.getElementById('submitBtn').innerText = "Login";
    document.getElementById('signIn').style.color = 'black';
    document.getElementById('signUp').style.color = 'white';
    const nameInput = document.getElementById('name');
    nameInput.style.display = 'none';
    nameInput.removeAttribute('required');
    document.getElementById('nameLabel').style.display = 'none';
    action = 'signin';
});

document.getElementById('signUp').addEventListener('click', function() {
    document.querySelector('.toggle-btn').style.left = '50%';
    document.getElementById('submitBtn').innerText = "Register";
    document.getElementById('signUp').style.color = 'black';
    document.getElementById('signIn').style.color = 'white';
    const nameInput = document.getElementById('name');
    nameInput.style.display = 'block';
    nameInput.setAttribute('required', '');
    document.getElementById('nameLabel').style.display = 'block';
    action = 'signup';
});

function saveToken(token) {
    localStorage.setItem('token', token);
}

function getToken() {
    return localStorage.getItem('token');
}

function removeToken() {
    localStorage.removeItem('token');
}

document.getElementById('authForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
        let response;
        if (action === 'signin') {
            response = await fetch(API_ROUTES.AUTH.LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
        } else {
            const username = document.getElementById('name').value;
            console.log(username);
            response = await fetch(API_ROUTES.AUTH.REGISTER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error');
        }
        saveToken(data.token);
        window.location.href = '/';

    } catch (error) {
        console.error('Erreur:', error);
        alert(error.message);
    }
});