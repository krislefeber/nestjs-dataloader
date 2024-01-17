import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "./../src/app.module";
import { AccountService } from "../src/account/account.service";

describe("AppModule", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(() => app.close());

  it("defined", () => expect(app).toBeDefined());

  it("/graphql(POST) getAccounts", async () => {
    const accountService = app.get(AccountService);
    jest
      .spyOn(accountService, "findByIds")
      .mockResolvedValueOnce([{ id: "30", name: "name" }]);

    const query = request(app.getHttpServer()).post;
    const result = await query("/graphql")
      .send({
        query: `
          query q($ids: [ID!]!) {
            getAccounts(ids: $ids) {
              id
            }
          }
        `,
        variables: {
          ids: ["30"],
        },
      })
      .set("Apollo-Require-Preflight", "true")
      .expect(200);

    expect(result.body.data.getAccounts).toStrictEqual([{ id: "30" }]);
    expect(result.errors).toBeUndefined();
  });
});
