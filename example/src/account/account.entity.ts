import { ObjectType, Field, ID } from "@nestjs/graphql";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("accounts")
@ObjectType()
export class Account {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  readonly id: string;

  @Column()
  readonly name: string
}
