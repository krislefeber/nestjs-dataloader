import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import { AccountModule } from "./account/account.module";

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      debug: true,
    }),
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "sample",
      entities: [join(__dirname, "./**/*.entity.[t|j]s")],
      synchronize: true,
    }),
    AccountModule,
  ]
})
export class AppModule {}
