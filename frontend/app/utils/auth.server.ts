import type { LoaderFunctionArgs } from "react-router";
import { authenticateWithRefresh } from "../services/authService";

/**
 * Server-side authentication helper for route loaders
 */
export async function requireUser(_request: LoaderFunctionArgs["request"] | undefined) {
  // Safety check for browser environment
  if (typeof window === 'undefined') {
    console.error('Authentication check attempted in non-browser environment');
    return null;
  }
  
  try {
    // Use the centralized authentication service
    return await authenticateWithRefresh();
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}