import * as fs   from "fs";
import * as path from "path";
import { readProtocolFile }    from "./parser";
import { generateFullPageHTML } from "./template/page";

const DEFAULT_PROTOCOL_FILE = "./openEntityChannels.json";
const DEFAULT_OUTPUT_FILE   = "./public/index.html";

function resolveInputFilePath(): string {
  return process.argv[2] || DEFAULT_PROTOCOL_FILE;
}

function resolveOutputFilePath(): string {
  return process.argv[3] || DEFAULT_OUTPUT_FILE;
}

function ensureOutputDirectoryExists(outputFilePath: string): void {
  const outputDir = path.dirname(outputFilePath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
}

function writeHtmlToOutputFile(html: string, outputFilePath: string): void {
  fs.writeFileSync(outputFilePath, html, "utf-8");
}

function printGenerationSuccessMessage(inputFilePath: string, outputFilePath: string): void {
  console.log("\n✅ Interface generated successfully!");
  console.log("   Input  →", path.resolve(inputFilePath));
  console.log("   Output →", path.resolve(outputFilePath));
  console.log("\n   Open the output file in your browser to view the interface.\n");
}

function main(): void {
  const inputFilePath  = resolveInputFilePath();
  const outputFilePath = resolveOutputFilePath();

  const protocol      = readProtocolFile(inputFilePath);
  const generatedHtml = generateFullPageHTML(protocol);

  ensureOutputDirectoryExists(outputFilePath);
  writeHtmlToOutputFile(generatedHtml, outputFilePath);
  printGenerationSuccessMessage(inputFilePath, outputFilePath);
}

main();
