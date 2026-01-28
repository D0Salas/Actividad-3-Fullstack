export const obtenerUsuarios = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        { id: 1, nombre: "Ana", rol: "Admin" },
        { id: 2, nombre: "Luis", rol: "Usuario" },
        { id: 3, nombre: "Ana", rol: "Usuario" }
      ]);
    }, 1500);
  });
};