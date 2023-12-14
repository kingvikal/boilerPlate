import { User } from "../models/userModel";
import bcrypt from "bcrypt";

export const GetUserById = async (id: any) => {
  const user = await User.findOne({ where: { id: id } });

  return user;
};

export const GetUsers = async (payload: any) => {
  const { page, limit, search } = payload;

  const skipIndex: any = (page - 1) * limit;

  const users = User.createQueryBuilder("user")
    .select(["user.id", "user.firstname", "user.lastname", "user.email"])
    .where("user.status = :status", { status: true });

  if (search) {
    users.andWhere("user.firstname LIKE :search", { search: `%${search}%` });
  }

  users.orderBy("user.id", "ASC");

  const user = await users.take(limit).skip(skipIndex).getMany();

  const count = await users.getCount();

  const totalPages = Math.ceil(count / limit);

  return { user, totalPages };
};

export const UpdateUser = async (id: any, payload: any) => {
  const { firstname, lastname, age, city, email, password, userType, status } =
    payload;

  const hashedPassword = bcrypt.hashSync(password, 12);

  const user = await User.findOne({ where: { id: id } });

  if (user) {
    user.age = age;
    user.firstname = firstname;
    user.lastname = lastname;
    user.city = city;
    user.email = email;
    user.password = hashedPassword;
    user.userType = userType;
    if (status) user.status = status;

    await user.save();
  }
  return user;
};

export const DeleteUser = async (id: any) => {
  const userDelete = await User.createQueryBuilder()
    .delete()
    .from(User)
    .where({ id: id })
    .execute();

  return userDelete;
};
