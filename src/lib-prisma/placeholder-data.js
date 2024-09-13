const users = [
    {
        id: '410544b2-4001-4271-9855-fec4b6a6442a',
        name: 'User',
        email: 'user@nextmail.com',
        password: '123456',
    },
];

const patients = [
    {
        id: 'f8b6e66f-0d84-493c-b141-d6d96e99e87a',
        name: 'João Silva',
        cpf: '123.456.789-00',
        address: 'Rua A, 123',
        neighborhood: 'Centro',
        number_house: '123',
        date_of_birth: '1980-05-10',
        sex: 'Masculino',
        civil_state: 'Solteiro',
        job: 'Engenheiro',
    },
    {
        id: '39a9de69-ff28-4a7e-854b-9b5c3e9d97b5',
        name: 'Maria Santos',
        cpf: '987.654.321-00',
        address: 'Rua B, 456',
        neighborhood: 'Vila Nova',
        number_house: '456',
        date_of_birth: '1975-08-22',
        sex: 'Feminino',
        civil_state: 'Casada',
        job: 'Advogada',
    },
    // Adicione mais pacientes aqui
    {
        id: 'cd3d4ec5-4fd1-43f7-856a-64824f0181e0',
        name: 'Pedro Oliveira',
        cpf: '234.567.890-00',
        address: 'Av. C, 789',
        neighborhood: 'Bairro Alto',
        number_house: '789',
        date_of_birth: '1992-12-15',
        sex: 'Masculino',
        civil_state: 'Solteiro',
        job: 'Professor',
    },
    {
        id: '8e165eb1-7cb2-4bbf-a462-3a24ae65d65b',
        name: 'Ana Souza',
        cpf: '345.678.901-00',
        address: 'Rua D, 321',
        neighborhood: 'Jardim das Flores',
        number_house: '321',
        date_of_birth: '1988-03-28',
        sex: 'Feminino',
        civil_state: 'Divorciada',
        job: 'Enfermeira',
    },
    // Adicione mais pacientes aqui
    {
        id: 'a2f5864b-b89f-43e7-b5ad-34347dd890f7',
        name: 'Luiz Costa',
        cpf: '456.789.012-00',
        address: 'Rua E, 987',
        neighborhood: 'Morro Azul',
        number_house: '987',
        date_of_birth: '1970-11-05',
        sex: 'Masculino',
        civil_state: 'Casado',
        job: 'Empresário',
    },
    {
        id: 'a146cf9a-864c-4c1e-9c28-1ddfd0d56cf9',
        name: 'Fernanda Lima',
        cpf: '567.890.123-00',
        address: 'Av. F, 654',
        neighborhood: 'Santa Cruz',
        number_house: '654',
        date_of_birth: '1985-09-17',
        sex: 'Feminino',
        civil_state: 'Solteira',
        job: 'Psicóloga',
    },
    // Adicione mais pacientes aqui
    {
        id: 'b3fb4e88-eb9b-4b40-8e69-22f2e931017b',
        name: 'Rafaela Santos',
        cpf: '678.901.234-00',
        address: 'Rua G, 135',
        neighborhood: 'Centro',
        number_house: '135',
        date_of_birth: '1996-07-08',
        sex: 'Feminino',
        civil_state: 'Solteira',
        job: 'Estudante',
    },
    {
        id: '97e8509a-9ec2-4c9c-8f9b-d8de72c2d879',
        name: 'Carlos Almeida',
        cpf: '789.012.345-00',
        address: 'Rua H, 246',
        neighborhood: 'Jardim Botânico',
        number_house: '246',
        date_of_birth: '1983-04-30',
        sex: 'Masculino',
        civil_state: 'Casado',
        job: 'Médico',
    },
    // Adicione mais pacientes aqui
    {
        id: '7923a7ec-7a39-4b27-bfbb-6a3ed3bb0dcf',
        name: 'Mariana Oliveira',
        cpf: '890.123.456-00',
        address: 'Av. I, 567',
        neighborhood: 'Centro',
        number_house: '567',
        date_of_birth: '1977-12-12',
        sex: 'Feminino',
        civil_state: 'Casada',
        job: 'Engenheira Civil',
    },
    {
        id: 'ee92d2b0-00a0-4a1c-a065-47abf424a738',
        name: 'Rodrigo Santos',
        cpf: '901.234.567-00',
        address: 'Rua J, 789',
        neighborhood: 'Vila Rica',
        number_house: '789',
        date_of_birth: '1990-02-25',
        sex: 'Masculino',
        civil_state: 'Solteiro',
        job: 'Contador',
    },
];

const classes = [
    {
        id: '8ff5e294-9435-4f91-99dc-29751de80f32',
        name: 'Pilates Senhorinhas',
        creation_date: '2024-04-01'
    },
    {
        id: 'a2f2ff3b-41d3-4992-95a0-b5aa373a53ef',
        name: 'Pilates Turma 1',
        creation_date: '2024-04-10'
    },
    {
        id: '6e20e32d-b142-4942-8a3f-531f4c12cbf3',
        name: 'Pilates Noite',
        creation_date: '2024-04-15'
    }
];

const appointments = [
    {
        type: 'padrão',
        date: '2024-04-01',
        start_time: '09:00:00'
    },
    {
        type: 'rpg',
        date: '2024-04-03',
        start_time: '10:00:00'
    },
    {
        type: 'auriculoterapia',
        date: '2024-04-05',
        start_time: '11:00:00'
    },
    {
        type: 'padrão',
        date: '2024-04-07',
        start_time: '12:00:00'
    },
    {
        type: 'rpg',
        date: '2024-04-10',
        start_time: '13:00:00'
    },
    {
        type: 'auriculoterapia',
        date: '2024-04-12',
        start_time: '14:00:00'
    },
    {
        type: 'padrão',
        date: '2024-04-15',
        start_time: '15:00:00'
    },
    {
        type: 'rpg',
        date: '2024-04-17',
        start_time: '16:00:00'
    },
];

module.exports = {
    users,
    patients,
    classes,
    appointments,
};