import type { BranchProvider } from "../interfaces/branch-provider";
import type { Branch, BranchId } from "../../domain";

const DEMO_BRANCHES: readonly Branch[] = [
  {
    identity: { id: "demo-branch-mashhad-central" },
    name: "شعبه مرکزی مشهد — Demo",
    code: "DEMO-MHD-01",
    location: {
      address: "آدرس نمایشی برای Demo",
      city: "مشهد",
      region: "خراسان رضوی",
      country: "ایران",
      postalCode: null,
      coordinates: null,
    },
    contact: { phone: null, email: null, website: null },
    operatingHours: [
      { dayOfWeek: "saturday", openTime: "10:00", closeTime: "20:00", isClosed: false },
      { dayOfWeek: "sunday", openTime: "10:00", closeTime: "20:00", isClosed: false },
      { dayOfWeek: "monday", openTime: "10:00", closeTime: "20:00", isClosed: false },
      { dayOfWeek: "tuesday", openTime: "10:00", closeTime: "20:00", isClosed: false },
      { dayOfWeek: "wednesday", openTime: "10:00", closeTime: "20:00", isClosed: false },
      { dayOfWeek: "thursday", openTime: "10:00", closeTime: "20:00", isClosed: false },
      { dayOfWeek: "friday", openTime: "16:00", closeTime: "20:00", isClosed: false },
    ],
    services: ["fitting", "consultation", "pickup", "returns"],
    status: "open",
  },
  {
    identity: { id: "demo-branch-tehran-central" },
    name: "شعبه مرکزی تهران — Demo",
    code: "DEMO-THR-01",
    location: {
      address: "آدرس نمایشی برای Demo",
      city: "تهران",
      region: "تهران",
      country: "ایران",
      postalCode: null,
      coordinates: null,
    },
    contact: { phone: null, email: null, website: null },
    operatingHours: [
      { dayOfWeek: "saturday", openTime: "10:00", closeTime: "20:00", isClosed: false },
      { dayOfWeek: "sunday", openTime: "10:00", closeTime: "20:00", isClosed: false },
      { dayOfWeek: "monday", openTime: "10:00", closeTime: "20:00", isClosed: false },
      { dayOfWeek: "tuesday", openTime: "10:00", closeTime: "20:00", isClosed: false },
      { dayOfWeek: "wednesday", openTime: "10:00", closeTime: "20:00", isClosed: false },
      { dayOfWeek: "thursday", openTime: "10:00", closeTime: "20:00", isClosed: false },
      { dayOfWeek: "friday", openTime: "16:00", closeTime: "20:00", isClosed: false },
    ],
    services: ["fitting", "consultation", "pickup", "returns"],
    status: "open",
  },
  {
    identity: { id: "demo-branch-shiraz-central" },
    name: "شعبه مرکزی شیراز — Demo",
    code: "DEMO-SHR-01",
    location: {
      address: "آدرس نمایشی برای Demo",
      city: "شیراز",
      region: "فارس",
      country: "ایران",
      postalCode: null,
      coordinates: null,
    },
    contact: { phone: null, email: null, website: null },
    operatingHours: [
      { dayOfWeek: "saturday", openTime: "10:00", closeTime: "20:00", isClosed: false },
      { dayOfWeek: "sunday", openTime: "10:00", closeTime: "20:00", isClosed: false },
      { dayOfWeek: "monday", openTime: "10:00", closeTime: "20:00", isClosed: false },
      { dayOfWeek: "tuesday", openTime: "10:00", closeTime: "20:00", isClosed: false },
      { dayOfWeek: "wednesday", openTime: "10:00", closeTime: "20:00", isClosed: false },
      { dayOfWeek: "thursday", openTime: "10:00", closeTime: "20:00", isClosed: false },
      { dayOfWeek: "friday", openTime: "16:00", closeTime: "20:00", isClosed: false },
    ],
    services: ["fitting", "consultation", "pickup", "returns"],
    status: "open",
  },
];

export class DemoBranchProvider implements BranchProvider {
  async listBranches(): Promise<readonly Branch[]> {
    return DEMO_BRANCHES;
  }

  async getBranch(id: BranchId): Promise<Branch | null> {
    return DEMO_BRANCHES.find((branch) => branch.identity.id === id.id) ?? null;
  }
}
