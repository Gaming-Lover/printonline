#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { env, exit } from "node:process";

const registryUrl = env.npm_config_registry || "https://registry.npmjs.org/";
const proxy = env.npm_config_https_proxy || env.npm_config_http_proxy || env.HTTPS_PROXY || env.HTTP_PROXY || env.https_proxy || env.http_proxy;

console.log(`Checking npm registry: ${registryUrl}`);
if (proxy) console.log(`npm/proxy environment detected: ${proxy}`);

const result = spawnSync("npm", ["ping", "--registry", registryUrl, "--loglevel", "error"], {
  encoding: "utf8",
  env: { ...env, npm_lifecycle_event: "npm:doctor:ping" }
});

if (result.status === 0) {
  console.log("npm registry reachable; npm install should be able to download dependencies.");
  exit(0);
}

const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim();
console.error(output || "npm ping failed without output");

if (output.includes("E403") || output.includes("403")) {
  console.error("\nDetected HTTP 403 from the npm registry path.");
  console.error("This is a network/proxy/registry policy block, not a PrintHub dependency problem.");
  console.error("Fix one of the following, then rerun `npm install`:");
  console.error("1. Allow outbound HTTPS to https://registry.npmjs.org/ through your proxy/firewall.");
  console.error("2. Remove or correct npm_config_http_proxy/npm_config_https_proxy, HTTP_PROXY, and HTTPS_PROXY if they point to a blocking proxy.");
  console.error("3. Configure an approved private npm mirror with `npm config set registry https://your-mirror/`.");
}

exit(result.status ?? 1);
