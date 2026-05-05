export type AuthUser = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
};

export type UsersResponse = {
  users: User[];
  total: number;
  skip: number;
  limit: number;
};

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  image: string;
  company: {
    title: string;
    department: string;
    name: string;
  };
  address: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
};

export type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

export type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  brand: string;
  tags: string[];
  images: string[];
  thumbnail: string;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  weight?: number;
  warrantyInformation?: string;
  shippingInformation?: string;
};
