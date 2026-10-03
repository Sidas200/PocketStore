const API_URL = "https://jsonplaceholder.typicode.com/users";

const catalog = document.getElementById("catalog");
const loading = document.getElementById("loading");
const connectionStatus = document.getElementById("connection-status");



async function loadCatalog() {

    try {

        loading.style.display = "block";

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Error al obtener la información");
        }

        const users = await response.json();

        showCatalog(users);

    } catch (error) {

        console.error("Error:", error);

        catalog.innerHTML = `
            <div class="card">
                <h3>No fue posible cargar el catálogo</h3>
                <p>
                    Conéctate a internet al menos una vez
                    para descargar la información.
                </p>
            </div>
        `;

    } finally {

        loading.style.display = "none";

    }
}



function showCatalog(users) {

    catalog.innerHTML = "";

    users.forEach(user => {

        const card = document.createElement("article");

        card.classList.add("card");

        card.innerHTML = `
            <h3>${user.name}</h3>

            <p>
                <strong>Usuario:</strong>
                ${user.username}
            </p>

            <p>
                <strong>Email:</strong>
                ${user.email}
            </p>

            <p>
                <strong>Teléfono:</strong>
                ${user.phone}
            </p>

            <p>
                <strong>Ciudad:</strong>
                ${user.address.city}
            </p>

            <p class="company">
                🏢 ${user.company.name}
            </p>
        `;

        catalog.appendChild(card);

    });

}


function updateConnectionStatus() {

    if (navigator.onLine) {

        connectionStatus.textContent = "🟢 Con conexión";

        connectionStatus.classList.remove("offline");

        connectionStatus.classList.add("online");

    } else {

        connectionStatus.textContent = "🔴 Modo Offline";

        connectionStatus.classList.remove("online");

        connectionStatus.classList.add("offline");

    }

}


window.addEventListener("online", updateConnectionStatus);

window.addEventListener("offline", updateConnectionStatus);



if ("serviceWorker" in navigator) {

    window.addEventListener("load", async () => {

        try {

            const registration =
                await navigator.serviceWorker.register("./sw.js");

            console.log(
                "Service Worker registrado correctamente:",
                registration
            );

        } catch (error) {

            console.error(
                "Error al registrar Service Worker:",
                error
            );

        }

    });

}


updateConnectionStatus();

loadCatalog();