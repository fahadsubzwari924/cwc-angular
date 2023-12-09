export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  age?: number;
  country?: string;
  city?: string;
  address?: string;
  contactNumber?: string;
  createdAt: Date;
  updatedAt?: Date;

  constructor(user: any) {
    this.id = user?.id;
    this.name = user?.fullName;
    this.email = user?.email;
    this.password = user?.password;
    this.age = user?.age;
    this.country = user?.country;
    this.city = user?.city;
    this.address = user?.address;
    this.createdAt = user?.createdAt;
    this.updatedAt = user?.updatedAt;
  }
}
