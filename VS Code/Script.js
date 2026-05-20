
// HOME PAGE
function teacherLogin() {
    window.location.href = "login.html?role=teacher";
}

function studentLogin() {
    window.location.href = "login.html?role=student";
}

// REGISTER
function registerUser() {

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let role = document.getElementById("role").value;

    if (!username || !password || !role) {
        alert("Please fill all fields");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let exists = users.find(u => u.username === username);

    if (exists) {
        alert("User already exists");
        return;
    }

    users.push({ username, password, role });

    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration Successful");
    window.location.href = "login.html";
}

// LOGIN
function loginUser() {

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        alert("Invalid Username or Password");
        return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));

    window.location.href = "Dashboard.html";
}