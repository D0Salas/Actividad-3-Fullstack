import { Usuario } from "./user.js";

// Arrow function
export const crearUsuarios = (datos = []) => {
  return datos.map(({ nombre, rol }) => new Usuario(nombre, rol));
};

// Map y Set
export const obtenerRolesUnicos = (usuarios) => {
  const roles = usuarios.map(user => user.rol);
  return new Set(roles);
};

// Spread operator + rest parameters
export const combinarUsuarios = (...listasUsuarios) => {
  return [...listasUsuarios.flat()];
};