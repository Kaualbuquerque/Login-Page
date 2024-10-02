// Controlador do botão de alternância
let isToggled = false;
const urlParams = new URLSearchParams(window.location.search);
const loginStatus = urlParams.get('login');
const transition = document.getElementById('transition');

if (loginStatus === 'success') {
  transition.classList.add("login-success");
  const h2 = transition.querySelector('h2');
  const p = transition.querySelector('p');
  const button = transition.querySelector("button")
  h2.textContent = "Login Success";
  p.textContent = "You have successfully logged in!";
  button.remove();
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

// Função para registrar um novo usuário usando localStorage
function registerUser(email, password, phone, dob) {
  const users = JSON.parse(localStorage.getItem('users')) || [];

  // Verifica se o email já está cadastrado
  const userExists = users.some(user => user.email === email);
  if (userExists) {
    alert('Email já cadastrado');
    return;
  }

  // Adiciona o novo usuário ao localStorage
  const newUser = { email, password, phone, dob };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  alert('Usuário registrado com sucesso!');
}

// Função para fazer login usando localStorage
function loginUser(email, password) {
  const users = JSON.parse(localStorage.getItem('users')) || [];

  // Verifica se o usuário existe e a senha está correta
  const user = users.find(user => user.email === email && user.password === password);
  if (user) {
    window.location.href = '/?login=success';
  } else {
    alert('Email ou senha inválidos');
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
    alert("Senhas diferentes");
  }
});

// Manipulador de eventos para o formulário de login
$("#loginForm").on('submit', (e) => {
  e.preventDefault();
  const email = $("#Email-signIn").val();
  const password = $("#password-signIn").val();

  loginUser(email, password);
});
