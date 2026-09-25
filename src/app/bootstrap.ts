import { readAppConfig } from "../config/app-config";
import { FoundationFeature } from "../features/foundation/foundation-feature";
import { DemoFoundationProvider } from "../providers/demo/demo-foundation-provider";
import { FoundationService } from "../services/foundation-service";
import { createRouter } from "./routing/create-router";
import { renderApplicationShell } from "../ui/render-application-shell";

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
  const status = feature.getStatus();

  createRouter(root, (match) => {
    renderApplicationShell(root, match, status);
  });
}