let token = '';

async function register() {
  await fetch('/register', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      email: regEmail.value,
      password: regPass.value
    })
  });
  alert('Usuario registrado');
}

async function login() {
  const res = await fetch('/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      email: logEmail.value,
      password: logPass.value
    })
  });

  const data = await res.json();
  token = data.token;
  alert('Login exitoso');
  cargarTareas();
}

async function cargarTareas() {
  const res = await fetch('/tareas', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const tareas = await res.json();
  lista.innerHTML = '';

  tareas.forEach(t => {
    const li = document.createElement('li');
    li.textContent = t.texto;

    const btn = document.createElement('button');
    btn.textContent = '❌';
    btn.onclick = () => borrarTarea(t.id);

    li.appendChild(btn);
    lista.appendChild(li);
  });
}

async function addTask() {
  await fetch('/tareas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ texto: taskText.value })
  });

  taskText.value = '';
  cargarTareas();
}

async function borrarTarea(id) {
  await fetch(`/tareas/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  cargarTareas();
}
