const form = document.getElementById("loginForm");
// const submitButton = document.getElementById("submitButton");
const user = document.getElementById('userInput');
const password = document.getElementById('passwordInput');

form.addEventListener('submit', e => {
    e.preventDefault();
    const path = location.href.replace("login.html", "php/login.php");

    fetch(path, {
        method: "POST",
        body: JSON.stringify({
            user: user.value,
            password: password.value,
        }),
        headers: {
            "Content-Type": "application/json"
        },
    })
    .then(res => res.json())
    .then(data => {
        // console.log(data);
        if (data.ok){
            // Guardando algunas variables para que la página de home las pueda utilizar más tarde
            sessionStorage.setItem("user", JSON.stringify({
                author: data.data.user,
                role: data.data.role,
                id: data.data.id,
            }));
            if(location.href.endsWith('/')){
                location.href = `${localStorage.href}home.html`;
            }else{
                location.href = location.href.replace("login", "home");
            }
        }else{
            alert("Usuario no autorizado ✖️");
        }
    })
    .catch(err => {
        // console.log(err);
    })
})