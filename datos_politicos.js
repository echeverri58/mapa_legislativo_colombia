// Función temporal para obtener datos de prueba por cada departamento.
// Puedes reemplazar esta función más adelante para que lea desde un JSON real o una Base de Datos.
function obtenerPoliticos(departamento) {
    const depKey = departamento.replace(/\s+/g, '_').toLowerCase();
    return {
        senadores: [
            {
                id: "senador_1_" + depKey,
                nombre: "Juan Pérez (" + departamento + ")",
                partido: "Partido Liberal",
                votos: "125,000",
                // La foto se buscará en fotos_politicos/{id}/foto.jpg
                foto_path: "fotos_politicos/senador_1_" + depKey + "/foto.svg"
            },
            {
                id: "senador_2_" + depKey,
                nombre: "María Rodríguez (" + departamento + ")",
                partido: "Partido Conservador",
                votos: "98,500",
                foto_path: "fotos_politicos/senador_2_" + depKey + "/foto.svg"
            }
        ],
        representantes: [
            {
                id: "rep_1_" + depKey,
                nombre: "Carlos Gómez (" + departamento + ")",
                partido: "Pacto Histórico",
                votos: "45,200",
                foto_path: "fotos_politicos/rep_1_" + depKey + "/foto.svg"
            },
            {
                id: "rep_2_" + depKey,
                nombre: "Ana Martínez (" + departamento + ")",
                partido: "Centro Democrático",
                votos: "39,100",
                foto_path: "fotos_politicos/rep_2_" + depKey + "/foto.svg"
            }
        ]
    };
}
