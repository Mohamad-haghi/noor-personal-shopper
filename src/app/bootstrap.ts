import { readAppConfig } from "../config/app-config";
import { FoundationFeature } from "../features/foundation/foundation-feature";
import { DemoFoundationProvider } from "../providers/demo/demo-foundation-provider";
import { FoundationService } from "../services/foundation-service";
import { renderFoundationStatus } from "../ui/render-foundation";

export function startApplication(root: HTMLElement): void {
  const config = readAppConfig();

  if (config.mode !== "demo") {
    throw new Error(
      'Integrated mode is not available in this foundation. Set VITE_NOOR_MODE="demo".',
    );
  }

  const provider = new DemoFoundationProvider();
  const service = new FoundationService(provider);
  const feature = new FoundationFeature(service);

  renderFoundationStatus(root, feature.getStatus());
}