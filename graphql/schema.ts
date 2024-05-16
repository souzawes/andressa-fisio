import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
    type Patients {
        id: String
        name: String
        cpf: String
        address: String
        neighborhood: String
        number_house: String
        date_of_birth: Date
        sex: String
        civil_state: String
        job: String
    }

    type Query {
        patients: [Patients]!
    }

    
`;