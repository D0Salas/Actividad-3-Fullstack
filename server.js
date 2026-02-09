const express = require('express');
const fs = require('fs').promises;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

const TASKS_FILE = 'tareas.json';
const USERS_FILE = 'usuarios.json';
const SECRET = 'clave_secreta';

// ===== MIDDLEWARE BASE =====
app.use(express.json());
app.use(express.static('public'));

// ===== FUNCIONES UTILITARIAS =====
async function leerTareas() {
  try {
    const data = await fs.readFile(TASKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function guardarTareas(tareas) {
  await fs.writeFile(TASKS_FILE, JSON.stringify(tareas, null, 2));
}

async function leerUsuarios() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function guardarUsuarios(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

// ===== AUTENTICACIÓN =====
app.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const users = await leerUsuarios();

    if (users.find(u => u.email === email)) {
      return res.status(400).send('Usuario ya existe');
    }

    const hash = await bcrypt.hash(password, 10);
    users.push({ id: Date.now(), email, password: hash });

    await guardarUsuarios(users);
    res.send('Usuario registrado');
  } catch (err) {
    next(err);
  }
});

app.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const users = await leerUsuarios();

    const user = users.find(u => u.email === email);
    if (!user) return res.status(400).send('Usuario no encontrado');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).send('Password incorrecto');

    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

// ===== MIDDLEWARE PROTECCIÓN =====
function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).send('Acceso denegado');

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).send('Token inválido');
    req.user = user;
    next();
  });
}

// ===== CRUD TAREAS =====
app.get('/tareas', autenticarToken, async (req, res, next) => {
  try {
    res.json(await leerTareas());
  } catch (err) {
    next(err);
  }
});

app.post('/tareas', autenticarToken, async (req, res, next) => {
  try {
    const tareas = await leerTareas();
    const nueva = {
      id: Date.now(),
      texto: req.body.texto
    };
    tareas.push(nueva);
    await guardarTareas(tareas);
    res.send('Tarea agregada');
  } catch (err) {
    next(err);
  }
});

app.delete('/tareas/:id', autenticarToken, async (req, res, next) => {
  try {
    let tareas = await leerTareas();
    tareas = tareas.filter(t => t.id != req.params.id);
    await guardarTareas(tareas);
    res.send('Tarea eliminada');
  } catch (err) {
    next(err);
  }
});

// ===== MANEJO GLOBAL DE ERRORES =====
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.message);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ===== SERVIDOR =====
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});