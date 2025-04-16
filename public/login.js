function login() {
    var uname = document.getElementById('user').value;
    var password = document.getElementById('pass').value;
    if (uname == "Ajmal" && password == 'Ajmal07') {
        alert('Successfully Verified');
        return true;
    } else {
        alert('Enter Your Details');
        return false;
    }
}

var showPasswordIcon = document.getElementById('show-password');
var passwordField = document.getElementById('pass');

showPasswordIcon.addEventListener('click', function () {
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
    } else {
        passwordField.type = 'password';
    }
    showPasswordIcon.classList.add('blinking');

    setTimeout(function () {
        showPasswordIcon.classList.remove('blinking');
    }, 1000);
});