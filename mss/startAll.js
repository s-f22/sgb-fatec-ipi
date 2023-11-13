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
    'convidados',
    'avaliacao',
    'certificado',
    'ata'
];

services.forEach(service => {
    console.log(`Iniciando o serviço ${service}...`);
    exec(`cd "C:/Projeto-TCC/Clone_tcc_atual/sgb-fatec-ipi/mss/${service}" && npm start`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro ao iniciar o serviço ${service}: ${stderr}`);
        } else {
            console.log(`Serviço ${service} iniciado: ${stdout}`);
        }
    });
});
