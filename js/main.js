import { obtenerUsuarios } from "./dataService.js";
import { crearUsuarios, obtenerRolesUnicos } from "./userManager.js";

// let y const
let usuarios = [];
const iniciarApp = async () => {
  try {
    const datos = await obtenerUsuarios();
    usuarios = crearUsuarios(datos);
    console.log("📋 Lista de usuarios:");
    usuarios.forEach(user => console.log(user.descripcion()));
    const rolesUnicos = obtenerRolesUnicos(usuarios);
    console.log("🎯 Roles únicos:", rolesUnicos);
  } catch (error) {
    console.error("Error al cargar usuarios", error);
  }
};
iniciarApp();