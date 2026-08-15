import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const buildDir = path.join(projectRoot, "client", "dist-direct");
const exportDir = "/home/ubuntu/AI-Business-Idea-Atlas_export";
const sourceHtml = fs
  .readFileSync(path.join(buildDir, "index.html"), "utf8")
  .replace(/<script id="manus-runtime">[\s\S]*<\/body>/, "</body>");

const cssMatch = sourceHtml.match(/href="(\.\/assets\/[^\"]+\.css)"/);
const jsMatch = sourceHtml.match(/src="(\.\/assets\/[^\"]+\.js)"/);

if (!cssMatch || !jsMatch) {
  throw new Error("静的ビルドのCSSまたはJavaScriptを見つけられませんでした。");
}

const css = fs.readFileSync(path.join(buildDir, cssMatch[1]), "utf8");
const javascript = fs
  .readFileSync(path.join(buildDir, jsMatch[1]), "utf8")
  .replace(/<\/script/gi, "<\\/script");

const standaloneHtml = `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <meta name="description" content="HP・LP、SEO・GEO、SNS、AI導入支援、EC領域のAI活用事業案100件を比較・検討する意思決定ワークスペース。" />
    <meta name="theme-color" content="#090B0A" />
    <title>AI Business Idea Atlas | 100案を比較・検討する</title>
    <style>\n${css}\n</style>
  </head>
  <body>
    <div id="root"></div>
    <script>\n${javascript}\n</script>
  </body>
</html>`;

fs.writeFileSync(path.join(exportDir, "AI-Business-Idea-Atlas.html"), standaloneHtml, "utf8");
console.log(`Created ${path.join(exportDir, "AI-Business-Idea-Atlas.html")}`);
