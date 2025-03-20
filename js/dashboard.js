   // Check if user is logged in
   if (!sessionStorage.getItem('isLoggedIn')) {
    window.location.href = 'login.html';
}

function logout() {
    sessionStorage.clear();
    window.location.href = 'login.html';
}