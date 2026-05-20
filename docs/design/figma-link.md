# Figma reference

_Paste the Figma file URL here when available._

## How to give the design to Claude

1. **Preferred: Dev Mode MCP server.** Run the Figma desktop app, enable Dev Mode MCP server in preferences, and paste a frame link in chat.
2. **Fallback: PNG exports.** Drop frame exports into `figma-exports/` and reference them by filename.
3. **Last resort: public Figma link.** Make the file view-only-public and paste the URL; Claude fetches it via WebFetch (lower fidelity).
