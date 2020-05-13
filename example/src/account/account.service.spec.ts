import { Test, TestingModule } from "@nestjs/testing";
import { AccountService } from "./account.service";
import { Account } from "./account.entity";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("AccountService", () => {
  let service: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: getRepositoryToken(Account),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
