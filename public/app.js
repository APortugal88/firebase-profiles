// URLs de los emuladores
const PROJECT_ID = "demo-project"; // Tu ID de proyecto
const REGION = "us-central1";
const FUNCTIONS_URL = `http://localhost:5001/${PROJECT_ID}/${REGION}/api`;
// Función auxiliar para las llamadas a la API
async function callAPI(endpoint, method = "GET", body = null) {
  try {
    const response = await fetch(`${FUNCTIONS_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: body ? JSON.stringify(body) : null,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
// Función para actualizar la visibilidad de los componentes
function updateUIComponents(profileData) {
  if (profileData) {
    document.getElementById("profile-form").style.display = "none";
    document.getElementById("profile-display").style.display = "block";
    document.getElementById("profile-image").src = profileData.imageUrl || "";
    document.getElementById("profile-name").textContent = profileData.name;
    document.getElementById("profile-email").textContent = profileData.email;
  } else {
    document.getElementById("profile-form").style.display = "block";
    document.getElementById("profile-display").style.display = "none";
    document.getElementById("image-upload").style.display = "none";
  }
}

// Crear perfil
async function createProfile() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  if (!name || !email) {
    alert("Por favor completa todos los campos");
    return;
  }
  try {
    console.log("Enviando petición a:", `${FUNCTIONS_URL}/profiles/create`);
    const data = await callAPI("/profiles/create", "POST", { name, email });
    if (data.id) {
      localStorage.setItem("profileId", data.id);
      document.getElementById("profile-form").style.display = "none";
      document.getElementById("image-upload").style.display = "block";
    }
  } catch (error) {
    console.error("Error completo:", error);
    alert(`Error al crear el perfil: ${error.message}`);
  }
}
// Subir imagen
async function uploadImage() {
  const file = document.getElementById("image").files[0];
  const profileId = localStorage.getItem("profileId");

  if (!file || !profileId) {
    alert("Por favor selecciona una imagen");
    return;
  }
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const data = await callAPI(`/images/upload/${profileId}`, "POST", {
        image: e.target.result,
      });
      if (data.url) {
        loadProfile(profileId);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al subir la imagen");
    }
  };
  reader.readAsDataURL(file);
}

// Cargar perfil
async function loadProfile(profileId) {
  try {
    const data = await callAPI(`/profiles/${profileId}`, "GET");
    if (data) {
      updateUIComponents(data);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al cargar el perfil");
    localStorage.removeItem("profileId");
    updateUIComponents(null);
  }
}
// Al cargar la página, verificamos si hay un profileId
const profileId = localStorage.getItem("profileId");
if (profileId) {
  loadProfile(profileId);
} else {
  updateUIComponents(null);
}
