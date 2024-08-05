export class DashboardStatsModel {
  totalCustomers: DashboardStatsPropertyModel;
  totalProducts: DashboardStatsPropertyModel;
  totalOrders: DashboardStatsPropertyModel;
  totalPendingOrders: DashboardStatsPropertyModel;
  totalDispatchedOrders: DashboardStatsPropertyModel;
  totalDeliveredOrders: DashboardStatsPropertyModel;
  totalReturnedOrders: DashboardStatsPropertyModel;
  repeatedCustomerPercentage: DashboardStatsPropertyModel;
  totalRevenue: DashboardStatsPropertyModel;
  totalProfit: DashboardStatsPropertyModel;

  constructor(data: any) {
    this.totalCustomers = new DashboardStatsPropertyModel({
      name: 'Customers',
      count: data?.totalCustomers,
      icon: 'pi pi-users',
      widegtIconBackgroundColor: 'bg-blue-100',
      widegtIconTextColor: 'text-blue-500',
    });
    this.totalProducts = new DashboardStatsPropertyModel({
      name: 'Products',
      count: data?.totalProducts,
      icon: 'pi pi-th-large',
      widegtIconBackgroundColor: 'bg-cyan-100',
      widegtIconTextColor: 'text-cyan-500',
    });
    this.totalOrders = new DashboardStatsPropertyModel({
      name: 'Total Orders',
      count: data?.totalOrders,
      icon: 'pi pi-shopping-cart',
      widegtIconBackgroundColor: 'bg-orange-100',
      widegtIconTextColor: 'text-orange-500',
    });
    this.totalPendingOrders = new DashboardStatsPropertyModel({
      name: 'Pending Order',
      count: data?.totalPendingOrders,
      icon: 'pi pi-clock',
      widegtIconBackgroundColor: 'bg-purple-100',
      widegtIconTextColor: 'text-purple-500',
    });
    this.totalDispatchedOrders = new DashboardStatsPropertyModel({
      name: 'Dispatched Orders',
      count: data?.totalDispatchedOrders,
      icon: 'pi pi-list',
      widegtIconBackgroundColor: 'bg-yellow-100',
      widegtIconTextColor: 'text-yellow-500',
    });
    this.totalDeliveredOrders = new DashboardStatsPropertyModel({
      name: 'Delivered Orders',
      count: data?.totalDeliveredOrders,
      icon: 'pi pi-check',
      widegtIconBackgroundColor: 'bg-indigo-100',
      widegtIconTextColor: 'text-indigo-500',
    });
    this.totalReturnedOrders = new DashboardStatsPropertyModel({
      name: 'Returned Orders',
      count: data?.totalReturnedOrders,
      icon: 'pi pi-replay',
      widegtIconBackgroundColor: 'bg-bluegray-100',
      widegtIconTextColor: 'text-bluegray-500',
    });
    this.repeatedCustomerPercentage = new DashboardStatsPropertyModel({
      name: 'Repeated Customer',
      count: data?.repeatedCustomerPercentage,
      icon: 'pi pi-refresh',
      widegtIconBackgroundColor: 'bg-purple-100',
      widegtIconTextColor: 'text-purple-500',
    });
    this.totalRevenue = new DashboardStatsPropertyModel({
      name: 'Revenue',
      count: data?.totalRevenue,
      icon: 'pi pi-briefcase',
      widegtIconBackgroundColor: 'bg-pink-100',
      widegtIconTextColor: 'text-pink-500',
    });
    this.totalProfit = new DashboardStatsPropertyModel({
      name: 'Profit',
      count: data?.totalProfit,
      icon: 'pi pi-dollar',
      widegtIconBackgroundColor: 'bg-indigo-100',
      widegtIconTextColor: 'text-indigo-500',
    });
  }
}

export class DashboardStatsPropertyModel {
  name: string;
  count: number | string;
  icon: string;
  widegtIconBackgroundColor: string;
  widegtIconTextColor: string;

  constructor(data: any) {
    this.name = data?.name;
    this.count = data?.count;
    this.icon = data?.icon;
    this.widegtIconBackgroundColor = data?.widegtIconBackgroundColor;
    this.widegtIconTextColor = data?.widegtIconTextColor;
  }
}
