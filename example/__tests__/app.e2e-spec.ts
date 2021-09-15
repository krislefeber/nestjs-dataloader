import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import gql from "graphql-tag";
import { AppModule } from "./../src/app.module";
import { Factory } from "typeorm-factory";
import { Account } from "../src/account/account.entity";

describe("AppModule", () => {
  let app: INestApplication;
  let server: GraphQLModule["apolloServer"];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const module: GraphQLModule =
      moduleFixture.get<GraphQLModule>(GraphQLModule);

    server = module.apolloServer;
  });

  afterAll(() => app.close());

  it("defined", () => expect(app).toBeDefined());

  it("/graphql(POST) getAccounts", async () => {
    const f = new Factory(Account).attr("name", "name");
    const account = await f.create();
    const result = await server.executeOperation({
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
