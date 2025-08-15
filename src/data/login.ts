export async function fetchLoginData(email: string, password: string) {
  const dataLogin = [
    { email: "correo@correo.com", password: "admin123" },
    { email: "admin@admin.com", password: "admin123" },
  ];

  // Simular un retardo de 3 segundos
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const user = dataLogin.find((user) => user.email === email);

  if (!user) {
    return {
      success: false,
      msg: "El correo electrónico no está registrado",
    };
  }

  if (user.password !== password) {
    return {
      success: false,
      msg: "Contraseña incorrecta",
    };
  }

  return {
    success: true,
    msg: "Inicio de sesión exitoso",
  };
}

export async function fetchUserData() {
  // Simular un retardo de 3 segundos
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const token = localStorage.getItem("token");
  if (token) {
    return {
      name: "Administrator",
      email: "admin@admin.com",
      role: "admin",
    };
  }

  return new Error("No autorizado");
}
