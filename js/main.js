import { obtenerUsuarios } from "./dataService.js";
import { crearUsuarios, obtenerRolesUnicos } from "./userManager.js";

let usuarios = [];

const iniciarApp = async () => {
    try {
        // Mostrar estado de carga
        showLoading(true);
        const startTime = Date.now();
        
        // Obtener datos del servidor simulado
        const datos = await obtenerUsuarios();
        
        // Crear usuarios a partir de los datos
        usuarios = crearUsuarios(datos);
        
        // Calcular tiempo de carga
        const loadTime = Date.now() - startTime;
        
        // Actualizar interfaz
        updateUI(usuarios, loadTime);
        
        // También mostrar en consola (opcional)
        console.log(" Lista de usuarios:");
        usuarios.forEach(user => console.log(user.descripcion()));
        
        const rolesUnicos = obtenerRolesUnicos(usuarios);
        console.log(" Roles únicos:", rolesUnicos);
        
    } catch (error) {
        showError("Error al cargar usuarios: " + error.message);
        console.error("Error al cargar usuarios", error);
    } finally {
        showLoading(false);
    }
};

// Función para mostrar/ocultar carga
function showLoading(show) {
    const loadingEl = document.getElementById('loading');
    if (loadingEl) {
        loadingEl.style.display = show ? 'block' : 'none';
    }
}

// Función para mostrar error
function showError(message) {
    const userList = document.getElementById('userList');
    if (userList) {
        userList.innerHTML = `
            <div class="card" style="border-left-color: #dc3545;">
                <strong>❌ Error:</strong> ${message}
            </div>
        `;
    }
}

// Función principal para actualizar la interfaz
function updateUI(usuarios, loadTime) {
    // Actualizar estadísticas
    document.getElementById('userCount').textContent = usuarios.length;
    document.getElementById('loadTime').textContent = loadTime;
    
    // Mostrar lista de usuarios
    const userList = document.getElementById('userList');
    userList.innerHTML = usuarios.map(usuario => `
        <div class="card ${usuario.rol === 'Admin' ? 'admin' : ''}">
            <strong>${usuario.nombre}</strong>
            <div>Rol: ${usuario.rol}</div>
            <small>ID: ${usuarios.indexOf(usuario) + 1}</small>
        </div>
    `).join('');
    
    // Mostrar roles únicos
    const roles = obtenerRolesUnicos(usuarios);
    const rolesContainer = document.getElementById('rolesContainer');
    rolesContainer.innerHTML = Array.from(roles).map(rol => 
        `<span class="role-tag">${rol}</span>`
    ).join('');
}

// Iniciar la aplicación cuando se cargue la página
document.addEventListener('DOMContentLoaded', iniciarApp);

// También exportar para posibles usos en consola
window.miApp = {
    usuarios,
    reiniciar: iniciarApp
};
