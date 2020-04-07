import * as DataLoader from "dataloader";
import { Injectable } from "@nestjs/common";
import { NestDataLoader } from "../../..";
import { AccountService } from "./account.service";

@Injectable()
export class AccountLoader implements NestDataLoader<string, Account> {
  constructor(private readonly accountService: AccountService) {}

  generateDataLoader(): DataLoader<string, Account> {
    return new DataLoader<string, Account>((keys) =>
      this.accountService.findByIds(keys)
    );
  }
}
