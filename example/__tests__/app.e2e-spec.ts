import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { createTestClient } from "apollo-server-testing";
import gql from "graphql-tag";
import { AppModule } from "./../src/app.module";

describe("AppModule", () => {
  let app: INestApplication;
  let apolloClient: ReturnType<typeof createTestClient>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const module: GraphQLModule = moduleFixture.get<GraphQLModule>(
      GraphQLModule
    );
    // apolloServer is protected, we need to cast module to any to get it
    apolloClient = createTestClient((module as any).apolloServer);
  });

  afterAll(() => app.close());

  it("defined", () => expect(app).toBeDefined());

  it("/graphql(POST) getAccounts", async () => {
    const { query } = apolloClient;
    const result = await query({
      query: gql`
        query q($ids: [ID!]!) {
          getAccounts(ids: $ids) {
            id
          }
        }
      `,
      variables: {
        ids: ["id"],
      },
    });
    expect(result.errors).toMatchInlineSnapshot(`
      Array [
        [GraphQLError: The loader AccountLoader is not providedError: Nest could not find AccountLoader element (this provider does not exist in the current context)],
      ]
    `);
  });
});
