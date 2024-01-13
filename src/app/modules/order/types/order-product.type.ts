import { Product } from '../../product/models/product.model';
import { OrderProduct } from '../models/order-product.model';

export type ProductOrderProduct = Product | OrderProduct;
