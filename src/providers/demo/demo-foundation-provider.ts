import type { FoundationStatus } from "../../domain/foundation-status";
import type { FoundationProvider } from "../interfaces/foundation-provider";

export class DemoFoundationProvider implements FoundationProvider {
  getStatus(): FoundationStatus {
    return {
      mode: "demo",
      connectedToNoorServices: false,
    };
  }
}
