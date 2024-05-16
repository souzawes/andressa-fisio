export const resolvers = {
    Query: {
        patients: () => [
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
            }
        ]
    }
}