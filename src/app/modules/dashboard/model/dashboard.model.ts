export class DashboardStatsModel {
  totalCustomers: DashboardStatsPropertyModel;
  totalProducts: DashboardStatsPropertyModel;
  totalOrders: DashboardStatsPropertyModel;
  totalPendingOrders: DashboardStatsPropertyModel;
  totalDispatchedOrders: DashboardStatsPropertyModel;
  totalDeliveredOrders: DashboardStatsPropertyModel;
  totalReturnedOrders: DashboardStatsPropertyModel;
  repeatedCustomerPercentage: DashboardStatsPropertyModel;

  constructor(data: any) {
    this.totalCustomers = new DashboardStatsPropertyModel({
      name: 'Customers',
      count: data?.totalCustomers,
    });
    this.totalProducts = new DashboardStatsPropertyModel({
      name: 'Products',
      count: data?.totalProducts,
    });
    this.totalOrders = new DashboardStatsPropertyModel({
      name: 'Orders',
      count: data?.totalOrders,
    });
    this.totalPendingOrders = new DashboardStatsPropertyModel({
      name: 'Pending Order',
      count: data?.totalPendingOrders,
    });
    this.totalDispatchedOrders = new DashboardStatsPropertyModel({
      name: 'Dispatched Orders',
      count: data?.totalDispatchedOrders,
    });
    this.totalDeliveredOrders = new DashboardStatsPropertyModel({
      name: 'Delivered Orders',
      count: data?.totalDeliveredOrders,
    });
    this.totalReturnedOrders = new DashboardStatsPropertyModel({
      name: 'Returned Orders',
      count: data?.totalReturnedOrders,
    });
    this.repeatedCustomerPercentage = new DashboardStatsPropertyModel({
      name: 'Repeated Customer',
      count: data?.repeatedCustomerPercentage,
    });
  }
}

export class DashboardStatsPropertyModel {
  name: string;
  count: number | string;

  constructor(data: any) {
    this.name = data?.name;
    this.count = data?.count;
  }
}
