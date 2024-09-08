const form = document.getElementById("loginForm");
// const submitButton = document.getElementById("submitButton");
const user = document.getElementById('userInput');
const password = document.getElementById('passwordInput');
const colorInput = document.getElementById('colorPicker');

if (localStorage.getItem('user_color')) {
    colorInput.value = localStorage.getItem('user_color');
}

form.addEventListener('submit', e => {
    e.preventDefault();
    const path = location.href.replace('.html', '').replace("login", `php/login.php`);

    // console.log(colorInput.value);
    fetch(path, {
        method: "POST",
        body: JSON.stringify({
            user: user.value,
            password: password.value,
            color: colorInput.value,
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
                author: data.data.name,
                role: data.data.role,
            }));
            localStorage.setItem('user_color', data.data.user_color);
            location.href = location.href.replace("login", "home");

            // if(location.href.endsWith('/')){
            //     location.href = `${localStorage.href}home.html`;
            // }else{
            //     location.href = location.href.replace("login", "home");
            // }
        }else{
            alert("Usuario no autorizado ✖️");
        }
    })
    .catch(err => {
        // console.log(err);
    })
})