

const loginButton = document.getElementById('botonLogin');


document.addEventListener('DOMContentLoaded', () => {


    const autenticacionDeUsuario = localStorage.getItem('usuarioAutenticado');
    const nombreDeUsuario = localStorage.getItem('nombreDeUsuario');
    const contrasena = localStorage.getItem('contrasena');


    if (autenticacionDeUsuario === 'true') {
        loginButton.style.display = 'none';
        Swal.fire({
            title: 'Inicio de sesión automático',
            html:
                `<p>Bienvenido, ${nombreDeUsuario}.</p>` +
                '<p>Tu contraseña se guarda de forma segura.</p>',
        });
    }
   
    loginButton.addEventListener('click', () => {
        Swal.fire({
            title: 'Iniciar Sesión',
            html:
                '<input type="text" id="usuario" class="swal2-input" placeholder="Usuario">' +
                '<input type="password" id="contrasena" class="swal2-input" placeholder="Contraseña">',
            showCancelButton: true,
            confirmButtonText: 'Iniciar Sesión',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const nombreDeUsuario = Swal.getPopup().querySelector('#usuario').value;
                const contrasena = Swal.getPopup().querySelector('#contrasena').value;
                
                const emailValidacion = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                const emailValido = emailValidacion.test(nombreDeUsuario);

                const contrasenaValidacion = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                const contrasenaValida = contrasenaValidacion.test(contrasena);

                if (!emailValido) {
                    Swal.showValidationMessage('Correo electrónico no válido');
                } else if (!contrasenaValida) {
                    Swal.showValidationMessage('La contraseña debe tener al menos 8 caracteres con al menos una letra, un número y un signo (@$!%*?&)');
                } else {

                    localStorage.setItem('usuarioAutenticado', 'true');
                    localStorage.setItem('nombreDeUsuario', nombreDeUsuario);
                    localStorage.setItem('contrasena', contrasena);


                    Swal.fire('Sesión iniciada con éxito', '', 'success');

                    loginButton.style.display = 'none';
                }
            },

            
        });
    });
});