import "server-only";
import { cache } from "react";
import { getCurrentUser } from "./get-current-user";

// Request-scoped deduplication only; never cache identity across requests or tenants.
export const getPlatformUser = cache(getCurrentUser);
