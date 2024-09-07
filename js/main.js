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

// console.log('08:05'.replace(/0/g, (match) => '_')); // Resultado: '_8:_5' // Este código busca una coincidencia con expresiones regulares y ejecuta una función de remplazo, se me ocurre que puede ser útil para sustituir enlaces, en lugar de que el enlace este dentro de una etiqueta p, con replace puedo buscar un enlace y si lo encuentra remplazarlo con una etiqueta a con el mismo texto y los estilos que amerite.

const think = document.getElementById("thinking");
const form = document.getElementById("form")
const addUserButton = document.getElementById("addUser");
const addUserModal = document.getElementById("addUserModal");
const addUserForm = document.getElementById("addUserForm");
const exitModal = document.getElementById("exitAddUserModal");
const main = document.getElementById("main")

if (userData.role === "admin"){
    addUserButton.classList.remove('hide')
}

think.placeholder = `What's on your mind ${userData.author}`;

// función para cargar las ideas
const loadThinks = (oneLine=false) => {
    // NOTA: cuando en la consola aparece el siguiente mensaje:
    // SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
    // Eso quiere decir, entre otras cosas, que la URL a la que se hace la petición es incorrecta.

    // Definir los parametros a enviar (se puede utilizar esta forma o directamente escribiendolos en la URL con el formato de clave=valor y si son más de 1 parametros separados por "?" (pense que era con &), ej: https://dominio/php/thinkings?oneline=true )
    // PD ? es para incluir parámetros, si son más de uno se separan con &
    const params = new URLSearchParams({
        oneline: oneLine,
        id: userData.id,
    });

    // fetch(`https://homis.duckdns.org/admin-db/php/thinkings?oneline=true`)
    fetch(`https://homis.duckdns.org/admin-db/php/thinkings?${params.toString()}`)
        .then((res) => res.json())
        .then((data) => {
            const fragment = document.createDocumentFragment();
            // console.log(data);

            data.forEach((element) => {
                const author = element.author;
                const thinking = element.thinking;
                const fullDate = element.date.split(" ");
                const date = fullDate[0];
                const hour = `${fullDate[1]} ${fullDate[2].replace('0', '')} ${fullDate[3]}`;

                // <div class="options">
                //     <i class="fa-solid fa-pen" id="optionEdit" title="Edit message"></i>
                //     <i class="fa-solid fa-trash-can" id="optionDelete" title="Delete message"></i>
                // </div>
                
                const divContainer = document.createElement("DIV");
                const divData = document.createElement("DIV");
                const divThink = document.createElement("DIV");
                const divIconContainer = document.createElement("DIV");
                const divUserIcon = document.createElement("DIV");
                const divColum = document.createElement("DIV");
                const divOptions = document.createElement('DIV');
                const editIcon = document.createElement('I');
                const deleteIcon = document.createElement('I');
                const authorTitle = document.createElement("H5");
                const dateTitle = document.createElement("P"); //h6
                const dateHour = document.createElement("P"); //h6
                const paragraph = document.createElement("P");
                const userIcon = document.createElement('I')

                divContainer.classList.add("think__container");
                divData.classList.add("data");
                divThink.classList.add("think");
                divUserIcon.classList.add('user__icon');
                divIconContainer.classList.add("icon__container");
                divColum.classList.add('colum');
                authorTitle.classList.add("writer");
                dateHour.classList.add('writer', 'date');
                dateTitle.classList.add('writer');
                paragraph.classList.add("paragraph");
                // userIcon.classList.add("fa-regular", "fa-user"); // Same thing
                userIcon.classList.add(...["fa-regular", "fa-user"]);
                divOptions.classList.add('options')
                editIcon.classList.add('fa-solid', 'fa-pen');
                deleteIcon.classList.add('fa-solid', 'fa-trash-can')
                
                divContainer.setAttribute('data-aos','fade-down');
                // editIcon.setAttribute('title', 'Edit message');
                editIcon.title = 'Edit message';
                // editIcon.setAttribute('data-purpose', 'edit');
                editIcon.dataset.purpose = 'edit';
                // deleteIcon.setAttribute('title', 'Delete message')
                deleteIcon.title = 'Delete message';
                // deleteIcon.setAttribute('data-purpose', 'delete')
                deleteIcon.dataset.purpose = 'delete'

                authorTitle.textContent = author;
                dateTitle.textContent = date;
                paragraph.textContent = thinking;
                dateHour.textContent = hour;

                divThink.append(paragraph, divOptions);
                divData.append(divIconContainer, dateTitle);
                divContainer.append(divData, divThink);
                divUserIcon.appendChild(userIcon);
                divColum.append(authorTitle, dateHour);
                divIconContainer.append(divUserIcon, divColum);
                divOptions.append(editIcon, deleteIcon)

                fragment.append(divContainer);
            });
            if (oneLine) {
                // main.append(fragment);
                main.insertBefore(fragment, main.firstChild)
            } else{
                main.textContent = "";
                main.append(fragment);
            }
        })
        .catch((err) => console.log(err));
}

loadThinks()

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
            // alert('Publicado ✅')
            loadThinks(true)
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
        addUserModal.classList.remove('show');
        addUserButton.classList.remove("hide");
        form.reset()
    })
})

main.addEventListener("click", (e) => {
    if (e.target.dataset.purpose == 'edit') {
        const path = location.href.replace("home.html", "php/options.php");
        const new_message = prompt('Introduce el texto nuevo');
        console.log(new_message);
        // alert('Edit')
        fetch(path, {
            method: "POST",
            body: JSON.stringify({
                purpose: "edit",
                text: e.target.parentElement.previousSibling.textContent,
                author: userData.author,
                new_text: new_message,
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(data => {
            // console.log(data);
            if (data.ok) {
                e.target.parentElement.previousSibling.textContent = data.data.new_text;
            }else{
                alert('Error desconocido al editar el mensaje')
            }
        })
        .catch(err => {
            alert("Error desconocido al editar mensaje");
            console.log(err);
        })
    }else if (e.target.dataset.purpose == 'delete') {
        const path = location.href.replace("home.html", "php/options.php");
        // console.dir(e.target.parentElement.previousSibling.textContent);
        fetch(path, {
            method: "POST",
            body: JSON.stringify({
                purpose: "delete",
                text: e.target.parentElement.previousSibling.textContent,
                author: userData.author,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((res) => res.json())
        .then((data) => {
            // console.log(data);
            if (data.ok) {
                e.target.parentElement.parentElement.parentElement.remove();
                // alert("Mensaje eliminado con éxito");
            } else {
                alert("Ocurrio un error inesperado, no fue posible eliminar el mensaje");
            }
        })
        .catch((err) => {
            alert("Error inesperado al borrar mensaje");
            console.log(err);
        });
    }
});