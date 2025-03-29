export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: {
    rate: number;
    count: number;
  };
  image: string;
}
