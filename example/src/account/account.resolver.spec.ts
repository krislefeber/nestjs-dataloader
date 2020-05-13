import { Test, TestingModule } from "@nestjs/testing";
import { AccountResolver } from "./account.resolver";

describe("AccountResolver", () => {
  let resolver: AccountResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountResolver],
    }).compile();

    resolver = module.get<AccountResolver>(AccountResolver);
  });

  it("should be defined", () => expect(resolver).toBeDefined());
});
