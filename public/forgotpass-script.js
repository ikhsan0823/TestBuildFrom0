function myCloseFunctions() {
    window.location.href = '/';
}
async function sendResetEmail() {
    const emailpass = document.getElementById('emailpass').value;
    const response = await fetch('/forgot-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailpass }),
    });
    const data = await response.json();
    alert(data.message);
}
async function resetPassword() {
    const token = document.getElementById('token').value;
    const newPassword = document.getElementById('newPassword').value;

    try {
        const response = await fetch(`/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newPassword, token }),
        });
        
        const data = await response.json();
        alert(data.message);

        if (response.ok) {
            window.location.href = "/";
        }
    } catch (error) {
        console.error('Error during password reset:', error);
        alert('An error occurred during password reset.');
    }
}