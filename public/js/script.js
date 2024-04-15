fetch('/api/features?page=1&per_page=2')
            .then(response => response.json()) // Convertir la respuesta a JSON
            .then(data => {
                // Obtener la tabla
                const tabla = document.getElementById('tablaDatos');
                const tbody = tabla.getElementsByTagName('tbody')[0];

                // Iterar sobre los datos y crear filas para la tabla
                data.forEach(item => {
                    const fila = document.createElement('tr');

                    // Crear celdas y asignarles los valores de los datos
                    const celdaNombre = document.createElement('td');
                    celdaNombre.textContent = item.nombre;
                    fila.appendChild(celdaNombre);

                    const celdaEdad = document.createElement('td');
                    celdaEdad.textContent = item.edad;
                    fila.appendChild(celdaEdad);

                    const celdaEmail = document.createElement('td');
                    celdaEmail.textContent = item.email;
                    fila.appendChild(celdaEmail);

                    // Agregar la fila a la tabla
                    tbody.appendChild(fila);
                });
            })
            .catch(error => console.error('Error al obtener los datos:', error));