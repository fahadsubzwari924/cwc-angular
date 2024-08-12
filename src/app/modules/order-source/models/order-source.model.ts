import { OrderSourceType } from 'src/app/shared/enums/order-source.enum';

export const OrderSourceMapper: { [key: string]: string } = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  web: 'Web',
};

export class OrderSource {
  id?: number;
  name: string;
  description: string;
  type: string;
  createdAt: Date;
  updatedAt?: Date;

  constructor(orderSource: any) {
    this.id = orderSource?.id;
    this.name = orderSource?.name;
    this.description = orderSource?.description;
    this.type = OrderSourceMapper[orderSource.type];
    this.createdAt = orderSource?.createdAt;
    this.updatedAt = orderSource?.updatedAt;
  }
}
