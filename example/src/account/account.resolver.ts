import { Resolver, Args, Query } from "@nestjs/graphql";
import * as DataLoader from "dataloader";
import { Loader } from "../../..";
import { Account } from "./account.entity";
import { AccountLoader } from "./account.loader";

@Resolver("Account")
export class AccountResolver {
  @Query(() => [Account])
  public getAccounts(
    @Args({ name: "ids", type: () => [String] }) ids: string[],
    @Loader(AccountLoader.name)
    accountLoader: DataLoader<Account["id"], Account>
  ) {
    return accountLoader.loadMany(ids);
  }
}
