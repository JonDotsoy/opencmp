import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconRocket, IconBrandNextjs } from "@tabler/icons-react";
import {
  CodeBlock,
  CodeBlockBody,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockFiles,
  CodeBlockHeader,
  CodeBlockItem,
  CodeBlockSelect,
  CodeBlockSelectContent,
  CodeBlockSelectItem,
  CodeBlockSelectTrigger,
  CodeBlockSelectValue,
  type BundledLanguage,
} from "./ui/shadcn-io/code-block";
import { CodeTabs } from "@/components/ui/shadcn-io/code-tabs";

const codes = {
  "src/pages/index.astro": `\
---
import { CookieDialogSettings, CookiesManager } from "@/components/ui/cookies-manager";
---

<CookiesManager client:only="react" />
`,
  "src/app/layout.tsx": `\
import { CookieDialogSettings, CookiesManager } from "@/components/ui/cookies-manager";

// Layout is a Server Component by default
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>
        <CookiesManager  />
        {children}
      </main>
    </>
  )
}
`,
};

export function SamplesCodeTabs() {
  return (
    <>
      <CodeTabs lang="astro" codes={codes}></CodeTabs>
    </>
  );
}

const settingscodes = {
  "src/pages/index.astro": `\
---
import { CookieDialogSettings, CookiesManager } from "@/components/ui/cookies-manager";
---

<CookieDialogSettings client:load>
  <button>
    Customize your cookie preferences
  </button>
</CookieDialogSettings>
`,
};

export function SettingsCodeTabs() {
  return (
    <>
      <CodeTabs lang="astro" codes={settingscodes}></CodeTabs>
    </>
  );
}
