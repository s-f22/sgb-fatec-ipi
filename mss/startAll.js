const { exec } = require('child_process');

const services = [
    'alunos',
    'professores',
    'dia_aula',
    'horario_aula',
    'temas',
    'trabalhos',
    'grupos',
    'bancas',
    'convidados'
];

services.forEach(service => {
    console.log(`Iniciando o serviço ${service}...`);
    exec(`cd "D:/FATEC/TCC/sgb-fatec-ipi/mss/${service}" && npm start`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro ao iniciar o serviço ${service}: ${stderr}`);
        } else {
            console.log(`Serviço ${service} iniciado: ${stdout}`);
        }
    });
});
