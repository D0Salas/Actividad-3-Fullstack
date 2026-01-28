export class Usuario {
  constructor(nombre = "Sin nombre", rol = "Invitado") {
    this.nombre = nombre;
    this.rol = rol;
  }
  descripcion() {
    return `👤 Usuario: ${this.nombre} | Rol: ${this.rol}`;
  }
}