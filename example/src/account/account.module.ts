import { Module } from "@nestjs/common";
import { AccountResolver } from "./account.resolver";
import { AccountService } from "./account.service";
import { APP_INTERCEPTOR } from "@nestjs/core/constants";
import { DataLoaderInterceptor } from "../../..";
import { Account } from "./account.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [
    AccountResolver,
    AccountService,
    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },
  ],
})
export class AccountModule {}
