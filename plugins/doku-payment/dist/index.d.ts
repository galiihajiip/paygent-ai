import * as _$openclaw_plugin_sdk_core0 from "openclaw/plugin-sdk/core";

//#region index.d.ts
declare const _default: {
  id: string;
  name: string;
  description: string;
  configSchema: _$openclaw_plugin_sdk_core0.OpenClawPluginConfigSchema;
  register: NonNullable<_$openclaw_plugin_sdk_core0.OpenClawPluginDefinition["register"]>;
} & Pick<_$openclaw_plugin_sdk_core0.OpenClawPluginDefinition, "kind" | "reload" | "nodeHostCommands" | "securityAuditCollectors">;
//#endregion
export { _default as default };