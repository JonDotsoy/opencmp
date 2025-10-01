# OpenCMP Cookies Manager

![component demonstration snapshot](docs/assets/component-demo-snapshot.png)

OpenCMP Cookies Manager is a modern and comprehensive cookie consent management solution that simplifies the implementation of a CMP (Consent Management Platform) on your website. This tool is designed to integrate seamlessly with Google Tag Manager, providing users with an intuitive and customizable interface to configure their consent preferences.

## 🎯 Live Demo

**[👉 View Live Demo](https://jondotsoy.github.io/opencmp/)**

## 🌟 Key Features

- **Direct Google Tag Manager integration**: Automatic consent event configuration
- **Regulatory compliance**: Designed to comply with GDPR (EU General Data Protection Regulation) and CCPA (California Consumer Privacy Act)
- **Modern technology**: Built with React, Tailwind CSS and shadcn/ui
- **Easy installation**: Simple installation via shadcn CLI
- **Full control**: Completely customizable source code
- **Responsive**: Adaptive design for all devices
- **Accessible**: Meets web accessibility standards

## 🚀 Why OpenCMP?

In today's digital landscape, compliance with privacy regulations is essential. OpenCMP Cookies Manager allows you to:

- Comply with **GDPR** regulations from the European Union
- Adhere to California's **CCPA**
- Provide complete transparency about cookie usage
- Give users full control over their data
- Maintain user experience without compromising legal compliance

The platform facilitates technical implementation while ensuring your website complies with the strictest international data protection regulations.

## 📦 Quick Installation

Install OpenCMP Cookies Manager in your project using shadcn:

### NPX

```bash
npx shadcn@latest add https://jondotsoy.github.io/opencmp/cookies-manager.json
```

### PNPM

```bash
pnpm dlx shadcn@latest add https://jondotsoy.github.io/opencmp/cookies-manager.json
```

### Bun

```bash
bunx shadcn@latest add https://jondotsoy.github.io/opencmp/cookies-manager.json
```

## 🛠️ Configuration

Once installed, the component automatically integrates with your existing Tailwind CSS configuration and can be customized according to your project's specific needs.

### Usage in Astro.build

To use the component in an Astro project, import and add the component to your layout or page:

```astro
---
import {
  CookieDialogSettings,
  CookiesManager,
} from "@/components/ui/cookies-manager";
---

<CookiesManager client:only="react" />
```

### Usage in Next.js

To implement the component in Next.js, add it to your main layout:

```tsx
import {
  CookieDialogSettings,
  CookiesManager,
} from "@/components/ui/cookies-manager";

// Layout is a Server Component by default
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>
        <CookiesManager />
        {children}
      </main>
    </>
  );
}
```

## ⚙️ Preferences Button

In addition to the main `CookiesManager` component, you can also implement a preferences button that allows users to access cookie settings at any time after giving their initial consent.

### Button Implementation

```tsx
import { CookieDialogSettings } from "@/components/ui/cookies-manager";

function PreferencesButton() {
  return (
    <CookieDialogSettings>
      <button className="text-sm text-blue-600 hover:text-blue-800 underline">
        Cookie Preferences
      </button>
    </CookieDialogSettings>
  );
}
```

### Usage in Different Frameworks

**In Astro.build:**

```astro
---
import { CookieDialogSettings } from "@/components/ui/cookies-manager";
---

<CookieDialogSettings client:only="react">
  <button class="text-sm text-blue-600 hover:text-blue-800 underline">
    Cookie Preferences
  </button>
</CookieDialogSettings>
```

**In Next.js:**

```tsx
import { CookieDialogSettings } from "@/components/ui/cookies-manager";

export default function Footer() {
  return (
    <footer>
      <CookieDialogSettings>
        <button className="text-sm text-blue-600 hover:text-blue-800 underline">
          Cookie Preferences
        </button>
      </CookieDialogSettings>
    </footer>
  );
}
```

The `CookieDialogSettings` component acts as a wrapper that allows opening the cookie settings dialog when the child element is clicked. You can fully customize the style and appearance of the button according to your website's design.

## 📋 Requirements

- React 18+
- Tailwind CSS
- Google Tag Manager (for full integration)

## 📊 Google Tag Manager Integration

OpenCMP Cookies Manager is specifically designed to integrate seamlessly with **Google Tag Manager (GTM)** and its **Consent Mode** feature. This integration provides automated consent management that complies with privacy regulations while maintaining optimal website functionality.

### How the Integration Works

The cookie manager communicates with GTM through the global `dataLayer` variable (`window.dataLayer`), which is an array that GTM uses to receive and process events and data. Our implementation:

1. **Initializes default consent state** - Sets all consent types to "denied" by default (except necessary cookies)
2. **Sends consent events** - Automatically pushes consent updates to GTM when users make choices
3. **Manages consent types** - Handles the five standard GTM consent parameters:

#### Consent Parameters

| Parameter                 | Description                                                                        | Default State |
| ------------------------- | ---------------------------------------------------------------------------------- | ------------- |
| `ad_storage`              | Enables storage related to advertising (cookies, local storage)                    | `denied`      |
| `analytics_storage`       | Enables storage related to analytics (visit duration, demographics)                | `denied`      |
| `functionality_storage`   | Enables storage supporting website functionality (language settings, preferences)  | `granted` \*  |
| `personalization_storage` | Enables storage for personalization (video recommendations, content customization) | `denied`      |
| `security_storage`        | Enables storage for security (authentication, fraud prevention, user protection)   | `granted` \*  |

\* _Always granted as these are strictly necessary for basic website operation and security_

### Technical Implementation

The integration works through GTM's `gtag()` function, which pushes consent events to the dataLayer:

```javascript
// Default consent initialization
gtag("consent", "default", {
  ad_storage: "denied",
  analytics_storage: "denied",
  functionality_storage: "granted",
  personalization_storage: "denied",
  security_storage: "granted",
});

// Consent updates when user makes choices
gtag("consent", "update", {
  ad_storage: "granted", // Updated based on user choice
  analytics_storage: "granted",
  // ... other parameters
});
```

### User Actions and GTM Events

The cookie manager triggers consent updates in the following scenarios:

- **"Accept All Cookies"** - Sets all consent types to `"granted"`
- **"Reject All Cookies"** - Sets non-essential consent types to `"denied"` (functionality and security remain `"granted"`)
- **Custom preferences via settings panel** - Updates individual consent types based on user toggles

### GTM Configuration Benefits

This integration enables GTM to:

- **Automatically adjust tag behavior** based on consent status
- **Respect user privacy preferences** for all connected services (Google Analytics, Google Ads, etc.)
- **Maintain compliance** with GDPR, CCPA and other privacy regulations
- **Provide granular control** over data collection and processing

### For Developers

To ensure proper GTM integration:

1. Make sure GTM is installed on your website before implementing the cookie manager
2. Configure your GTM tags to respect consent settings
3. Use GTM's built-in consent checks for Google services
4. Test consent mode functionality in GTM's preview mode

For more information about GTM Consent Mode, visit the [official Google Tag Manager documentation](https://support.google.com/tagmanager/answer/10718549?hl=en).

## 🔧 Preferences State Management

OpenCMP Cookies Manager uses a reactive state management system that automatically synchronizes user preferences with local storage and GTM consent events. This system provides developers with programmatic access to observe and modify cookie consent preferences.

### State Storage and Persistence

The consent preferences are stored using a persistent atom that automatically synchronizes with the browser's local storage:

- **Storage Key**: `cookies-preferences`
- **Storage Type**: localStorage (browser persistent storage)
- **Data Format**: JSON serialized object
- **Reactive Updates**: Real-time synchronization across browser tabs

### Accessing Preferences State

You can access and observe the preferences state by importing the `preferencesState` from the cookie manager:

```typescript
import { preferencesState } from "@/components/ui/cookies-manager";

// Subscribe to preference changes
preferencesState.subscribe((newPreferences) => {
  console.log("Consent preferences updated:", newPreferences);

  // React to specific consent changes
  if (newPreferences.analytics_storage === "granted") {
    // Initialize analytics tracking
    initializeAnalytics();
  }

  if (newPreferences.ad_storage === "granted") {
    // Enable advertising features
    enableAdvertising();
  }
});
```

### Modifying Preferences Programmatically

You can programmatically modify consent preferences using the `set` method:

```typescript
import { preferencesState } from "@/components/ui/cookies-manager";

// Grant specific consent type
preferencesState.set({
  ...preferencesState.get(),
  ad_storage: "granted",
});

// Update multiple preferences at once
preferencesState.set({
  ...preferencesState.get(),
  analytics_storage: "granted",
  personalization_storage: "granted",
  alreadyChosen: true,
});

// Reset to default state
preferencesState.set({
  alreadyChosen: false,
  ad_storage: "denied",
  analytics_storage: "denied",
  functionality_storage: "granted",
  personalization_storage: "denied",
  security_storage: "granted",
});
```

### Preferences Object Structure

The preferences state contains the following properties:

```typescript
type Preferences = {
  alreadyChosen: boolean; // Whether user has made a consent choice
  ad_storage: "granted" | "denied"; // Advertising storage consent
  analytics_storage: "granted" | "denied"; // Analytics storage consent
  functionality_storage: "granted" | "denied"; // Functionality storage consent
  personalization_storage: "granted" | "denied"; // Personalization storage consent
  security_storage: "granted" | "denied"; // Security storage consent
};
```

### Common Use Cases

#### Conditionally Load Third-Party Scripts

```typescript
preferencesState.subscribe((preferences) => {
  if (preferences.analytics_storage === "granted") {
    // Load Google Analytics
    loadGoogleAnalytics();
  }

  if (preferences.ad_storage === "granted") {
    // Load advertising scripts
    loadAdvertisingScripts();
  }
});
```

#### Update UI Based on Consent

```typescript
preferencesState.subscribe((preferences) => {
  // Show/hide personalization features
  const personalizedContent = document.getElementById("personalized-content");
  if (preferences.personalization_storage === "granted") {
    personalizedContent.style.display = "block";
  } else {
    personalizedContent.style.display = "none";
  }
});
```

#### Reset Preferences (for Testing)

```typescript
import { restartPreferences } from "@/components/ui/cookies-manager";

// Reset all preferences to default state
restartPreferences();
```

### Integration with React Components

The preferences state works seamlessly with React hooks:

```typescript
import { useStore } from "@nanostores/react";
import { preferencesState } from "@/components/ui/cookies-manager";

function MyComponent() {
  const preferences = useStore(preferencesState);

  return (
    <div>
      {preferences.analytics_storage === "granted" && (
        <AnalyticsComponent />
      )}
      {preferences.personalization_storage === "granted" && (
        <PersonalizedRecommendations />
      )}
    </div>
  );
}
```

This reactive state management ensures that your application responds immediately to user consent changes while maintaining data persistence across browser sessions.

## 🤝 Contributing

Contributions are welcome. Please read our contribution guidelines before submitting a pull request.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
