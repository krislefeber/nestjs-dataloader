import DataLoader = require("dataloader");
import { Injectable } from "@nestjs/common";
import { NestDataLoader } from "../../..";
import { AccountService } from "./account.service";
import { Account } from "./account.entity";

@Injectable()
export class AccountLoader implements NestDataLoader<string, Account> {
  constructor(private readonly accountService: AccountService) {}

  generateDataLoader(): DataLoader<string, Account> {
    return new DataLoader<string, Account>(keys =>
      this.accountService.findByIds(keys)
    );
  }
}
