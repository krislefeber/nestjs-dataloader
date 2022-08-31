import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Account } from "./account.entity";
import { Repository, In } from "typeorm";

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accounts: Repository<Account>
  ) {}

  async findByIds(ids: readonly string[]) {
    return this.accounts.findBy({
      id: In(ids as string[]),
    });
  }
}
