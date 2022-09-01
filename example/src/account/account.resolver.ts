import { Resolver, Args, Query, ID } from "@nestjs/graphql";
import * as DataLoader from "dataloader";
import { Loader } from "../../../index";
import { Account } from "./account.entity";
import { AccountLoader } from "./account.loader";

@Resolver("Account")
export class AccountResolver {
  @Query(() => [Account])
  public getAccounts(
    @Args({ name: "ids", type: () => [ID] }) ids: string[],
    @Loader(AccountLoader)
    accountLoader: DataLoader<Account["id"], Account>
  ): Promise<(Account | Error)[]> {
    return accountLoader.loadMany(ids);
  }
}
