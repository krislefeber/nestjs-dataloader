import { ObjectType, Field, ID } from "@nestjs/graphql";
import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("accounts")
@ObjectType()
export class Account {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  readonly id: string;
}
