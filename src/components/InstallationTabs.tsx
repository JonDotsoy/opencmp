import { CodeTabs } from "./ui/shadcn-io/code-tabs";

const codes = {
  npx: `npx shadcn@latest add https://jondotsoy.github.io/cookies-manager/cookies-manager.json`,
  pnpm: `pnpm dlx shadcn@latest add https://jondotsoy.github.io/cookies-manager/cookies-manager.json`,
  bun: `bunx shadcn@latest add https://jondotsoy.github.io/cookies-manager/cookies-manager.json`,
};

export function InstallationTabs() {
  return <CodeTabs codes={codes} lang="shell"></CodeTabs>;
}
