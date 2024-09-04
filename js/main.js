// Si el usuario no se ha autenticado enviarlo a la página de autenticación
const userData = JSON.parse(sessionStorage.getItem("user"));

// Intenta leer el usuario, si es undefined manda al usuario a que se autentique, si lanza error no hay información sobre el usuario, mandalo a que se cree su clave de autenticación (login)
try {
    if (userData.author == undefined) {
        location.href = location.href.replace("home", "login");
    }
} catch (error) {
    location.href = location.href.replace("home", "login");
}

const think = document.getElementById("thinking");
const form = document.getElementById('form')
const addUserButton = document.getElementById("addUser");
const addUserModal = document.getElementById("addUserModal");
const addUserForm = document.getElementById("addUserForm");
const exitModal = document.getElementById("exitAddUserModal");
const main = document.getElementById('main')

if (userData.role === "admin"){
    addUserButton.classList.remove('hide')
}

// función para cargar las ideas
const loadThinks = () => {
    // NOTA: cuando en la consola aparece el siguiente mensaje:
    // SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
    // Eso quiere decir, entre otras cosas, que la URL a la que se hace la petición es incorrecta.

    fetch('https://homis.duckdns.org/admin-db/dev/php/thinkings')
    .then(res => res.json())
    .then(data => {
        const fragment = document.createDocumentFragment()        

        data.forEach(element => {
            const author = element.author
            const thinking = element.thinking
            const date = element.date

            const divContainer = document.createElement('DIV')
            const divData = document.createElement('DIV')
            const divThink = document.createElement('DIV')
            const authorTitle = document.createElement('H5')
            const dateTitle = document.createElement('H6')
            const paragraph = document.createElement('P')

            divContainer.classList.add("think__container")
            divData.classList.add('data')
            divThink.classList.add('think')
            authorTitle.classList.add('author')
            dateTitle.classList.add('date')
            paragraph.classList.add('paragraph')

            authorTitle.textContent = author
            dateTitle.textContent = date
            paragraph.textContent = thinking

            divThink.appendChild(paragraph)
            divData.append(authorTitle, dateTitle)
            divContainer.append(divData, divThink)

            fragment.append(divContainer)
        });
        main.textContent = ''        
        main.append(fragment)
    })
    .catch(err => console.log(err))
}

loadThinks()
// if (userData.visited){
//     loadThinks()
// }

// Formulario para enviar idea
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const path = location.href.replace("home.html", "php/db.php");
    fetch(path, {
        method: "POST",
        body: JSON.stringify({
            author: userData.author,
            thinking: think.value,
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then(data => {
        // console.log(data);
        if (data.ok){
            // Si todo salio bien, entonces resliza una consulta para cargar los mensajes en la base de datos
            alert('Publicado ✅')
            loadThinks()
        }
    })
    .catch(err => console.log(err))
})

addUserButton.addEventListener("click", (e) => {
    addUserModal.classList.add("show");
    addUserButton.classList.add("hide")
    // alert("boton presionado")
});

exitModal.addEventListener("click", (e) => {
    addUserModal.classList.remove("show");
    addUserButton.classList.remove("hide")
    // alert("cerrar boton presionado")
});

// Formulario para agregar usuarios
addUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const path = location.href.replace("home.html", "php/create.php");

    fetch(path, {
        method: "POST",
        body: JSON.stringify({
            name: addUserForm.children[0].value,
            last_name: addUserForm.children[1].value,
            user: addUserForm.children[2].value,
            password: addUserForm.children[3].value,
            role: addUserForm.children[4].children[0].value,
            permissions: userData.role,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then((res) => res.json())
    .then((data) => {
        // console.log(data);
    })
    .catch((err) => console.log(err))
    .finally(() => {
        addUserModal.classList.remove('show')
    })
})