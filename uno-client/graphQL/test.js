const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  type Player {
    id: ID!
    name: String!
  }
  type Query {
    players: [Player]
  }
`;

const players = [
  { id: 1, name: "Player1" },
  { id: 2, name: "Player2" },
];

const resolvers = {
  Query: {
    players: () => players,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
