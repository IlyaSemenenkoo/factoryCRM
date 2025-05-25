export enum OrderStatus {
  New = 0,
  Sewing = 1,
  Shoemaker = 2,
  Packing = 3,
  Shipped = 4,
  Stocked = 5
}

export const statusLabels: Record<OrderStatus, string> = {
  [OrderStatus.New]: "Новий",
  [OrderStatus.Sewing]: "Пошив",
  [OrderStatus.Shoemaker]: "Сапожник",
  [OrderStatus.Packing]: "Упаковка",
  [OrderStatus.Shipped]: "Відправлено",
  [OrderStatus.Stocked]: "На складі"
};

export const statusColors: Record<OrderStatus, string> = {
  [OrderStatus.New]: "#ccc",
  [OrderStatus.Sewing]: "#f0ad4e",
  [OrderStatus.Shoemaker]: "#5bc0de",
  [OrderStatus.Packing]: "#5cb85c",
  [OrderStatus.Shipped]: "#337ab7",
  [OrderStatus.Stocked]: "#292b2c"
};
