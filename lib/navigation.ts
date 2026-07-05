import type { LucideIcon } from "lucide-react";
import {
  ArrowDownToLine,
  Boxes,
  ClipboardList,
  Home,
  LayoutDashboard,
  ListChecks,
  MapPin,
  PackageCheck,
  ScanBarcode,
  Tag,
  Truck,
  Users,
  Wine,
} from "lucide-react";

export const NAV_ICONS = {
  dashboard: LayoutDashboard,
  inventory: Boxes,
  orders: ClipboardList,
  receiving: Truck,
  home: Home,
  inbound: ScanBarcode,
  picking: ListChecks,
  warehouse: ArrowDownToLine,
  products: Wine,
  locations: MapPin,
  allInventory: PackageCheck,
  users: Users,
  master: Tag,
} as const;

export type NavIconName = keyof typeof NAV_ICONS;

export type NavItem = {
  href: string;
  label: string;
  icon: NavIconName;
};

export function getNavIcon(name: NavIconName): LucideIcon {
  return NAV_ICONS[name];
}
