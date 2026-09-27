import {
  BadgeCheck,
  Boxes,
  Building2,
  Cable,
  Droplets,
  Flame,
  Gauge,
  Grid3x3,
  HeartPulse,
  Landmark,
  Layers,
  Leaf,
  Plane,
  Ruler,
  ScanLine,
  Scissors,
  ShieldCheck,
  Ship,
  Shuffle,
  Users,
  Warehouse,
  Zap,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import type { IconName } from "@/data/factoryData";

const icons: Record<IconName, LucideIcon> = {
  badgeCheck: BadgeCheck,
  boxes: Boxes,
  building: Building2,
  cable: Cable,
  droplets: Droplets,
  flame: Flame,
  gauge: Gauge,
  grid: Grid3x3,
  heartPulse: HeartPulse,
  landmark: Landmark,
  layers: Layers,
  leaf: Leaf,
  plane: Plane,
  ruler: Ruler,
  scanLine: ScanLine,
  scissors: Scissors,
  shieldCheck: ShieldCheck,
  ship: Ship,
  shuffle: Shuffle,
  users: Users,
  warehouse: Warehouse,
  zap: Zap,
};

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Component = icons[name];
  return <Component aria-hidden="true" {...props} />;
}
