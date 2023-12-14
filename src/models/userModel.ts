import { Column, Entity } from "typeorm";
import { base } from "./baseModel";

export enum userType {
  doctor = "doctor",
  patient = "patient",
  admin = "admin",
}

@Entity()
export class User extends base {
  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  age: number;

  @Column()
  city: string;

  @Column({ nullable: false })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  status: boolean;

  @Column({ type: "enum", enum: userType, nullable: false })
  userType: userType;
}
