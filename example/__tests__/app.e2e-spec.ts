import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloServerBase } from 'apollo-server-core';
import gql from "graphql-tag";
import { AppModule } from "./../src/app.module";
import { Factory } from '@linnify/typeorm-factory';
import { Account } from "../src/account/account.entity";
import { ApolloDriver } from "@nestjs/apollo";

class AccountFactory extends Factory<Account> {
  entity = Account;
  name = 'name'
}

describe("AppModule", () => {
  let app: INestApplication;
  let apolloClient: ApolloServerBase;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const graphqlModule = app.get<GraphQLModule<ApolloDriver>>(GraphQLModule);
    apolloClient = graphqlModule.graphQlAdapter?.instance;
  });

  afterAll(() => app.close());

  it("defined", () => expect(app).toBeDefined());

  it("/graphql(POST) getAccounts", async () => {
    const f = new AccountFactory();
    const account = await f.create();
    const result = await apolloClient.executeOperation({
      query: gql`
        query q($ids: [ID!]!) {
          getAccounts(ids: $ids) {
            id
          }
        }
      `,
      variables: {
        ids: [account.id],
      },
    });
    expect(result.errors).toBeUndefined();
  });
});
