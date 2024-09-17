// Controlador do botão de alternância
let isToggled = false;
const urlParams = new URLSearchParams(window.location.search);
const loginStatus = urlParams.get('login');
const transition = document.getElementById('transition');

if (loginStatus === 'success') {
  transition.classList.add("login-success");
  // Atualiza o texto do elemento
  const h2 = transition.querySelector('h2');
  const p = transition.querySelector('p');
  const button = transition.querySelector("button")
  h2.textContent = "Login Success";
  p.textContent = "You have successfully logged in!";
  button.remove()
}

// Alterna entre o estado de cadastro e login
$(".transition button").click(() => {
  if (isToggled) {
    $(".transition").css({
      "transform": "translateX(0)",
      "width": "50%",
    });

    $(".transition h2").text("Don't have an account?");
    $(".transition p").html("Fill in your details <br> and create your account!");
    $(".transition button").text("Create your account here!");
  } else {
    $(".transition").css({
      "transform": "translateX(-100%)",
      "width": "50%",
    });

    $(".transition h2").text("Welcome Back!");
    $(".transition p").html("To stay connected with us <br> log in with your account");
    $(".transition button").text("Sign in here!");
  }

  isToggled = !isToggled;
});

// Função para registrar um novo usuário
async function registerUser(email, password, phone, dob) {
  const response = await fetch('/register', { // Atualize a URL se necessário
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, phone, dob })
  });

  const result = await response.text();
  alert(result);
}

// Função para fazer login
async function loginUser(email, password) {
  const response = await fetch('/login', { // Atualize a URL se necessário
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
  });

  const result = await response.json();
  if (result.success) {
      // Redireciona para a página com o parâmetro 'login=success'
      window.location.href = result.redirectUrl;
    } else {
      // Mostra a mensagem de erro
      alert(result.message);
  }
}

// Manipulador de eventos para o formulário de cadastro
$("#registerForm").on('submit', (e) => {
  e.preventDefault();
  const email = $("#Email").val();
  const password = $("#password-signUp").val();
  const confirm_password = $("#confirm-password").val();
  const phone = $("#phone").val();
  const dob = $("#dob").val();

  if (password === confirm_password) {
    registerUser(email, password, phone, dob);
  } else {
    console.log("Senhas diferentes");
  }
});

// Manipulador de eventos para o formulário de login
$("#loginForm").on('submit', (e) => {
  e.preventDefault();
  const email = $("#Email-signIn").val();
  const password = $("#password-signIn").val();

  loginUser(email, password);
});
