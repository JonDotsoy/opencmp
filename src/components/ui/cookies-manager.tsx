"use client";
import type { PropsWithChildren } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useStore } from "@nanostores/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { persistentAtom } from "@nanostores/persistent";

const keyDataLayer = "dataLayer";

const gtag = (...args: any[]) => {
  if (typeof window === "undefined") return; // Skip during SSR
  const dataLayer = (window as any)[keyDataLayer] || [];
  (window as any)[keyDataLayer] = dataLayer;
  dataLayer.push(args);
};

const dialogs: Record<string, string> = {
  // InfoButton texts
  infoTitle: "¿Por qué las cookies necesarias siempre están activas?",
  infoDescription:
    "Las cookies necesarias incluyen tanto cookies de funcionalidad como de seguridad que son absolutamente esenciales para el funcionamiento del sitio web. Las de funcionalidad permiten navegación, formularios y características interactivas. Las de seguridad protegen contra amenazas cibernéticas, verifican identidad y mantienen sesiones seguras. Están clasificadas como 'estrictamente necesarias' según GDPR/CCPA y no requieren consentimiento explícito ya que son indispensables para el servicio básico.",
  understood: "Entendido",

  // Cookie Dialog Settings
  privacyTitle: "Centro de preferencias de la privacidad",
  privacyDescription:
    "A continuación te mostramos el detalle de las cookies que utilizamos en este sitio web. La información está organizada según la finalidad de cada tipo de cookie. Puedes configurar o activar aquellas que consideres adecuadas o rechazarlas todas. Las cookies técnicas se instalarán siempre ya que son esenciales para el funcionamiento básico del sitio. Haz clic en los encabezados de cada categoría para obtener más información y ajustar la configuración según tus preferencias. Ten en cuenta que bloquear ciertos tipos de cookies puede afectar tu experiencia de navegación y los servicios disponibles. Puedes consultar nuestra política de cookies en cualquier momento o",
  cookiesPolicyLink: "aquí",
  allowAll: "Permitir todas",
  manageConsent: "Gestionar las preferencias de consentimiento",

  // Cookie categories
  necessary: "Necesarias",
  alwaysActive: "Siempre activadas",
  functionality: "🔧 Funcionalidad",
  functionalityDescription:
    "Cookies esenciales para el correcto funcionamiento de las características del sitio web. Permiten funciones básicas como la navegación por páginas, el acceso a áreas seguras, y la utilización de características interactivas.",
  security: "🔒 Seguridad",
  securityDescription:
    "Cookies críticas para la seguridad del sitio web y la protección de los usuarios. Incluyen identificación de sesiones, prevención de ataques, autenticación de usuarios y protección contra accesos no autorizados.",

  analytics: "Analíticas",
  activated: "Activadas",
  analyticsDescription:
    "Estas cookies, propias o de terceros, responden al objetivo de obtener información sobre el rendimiento del sitio y la utilización del mismo por parte del usuario, como por ejemplo, realizar la medición y análisis de cómo llegan los usuarios al sitio y qué uso hacen del mismo. Asimismo, utilizamos estas cookies para elaborar modelos analíticos sobre la base de tu perfil comercial.",

  personalization: "Personalización",
  personalizationDescription:
    "Estas cookies permiten recordar información para que el usuario acceda al servicio con determinadas características que pueden diferenciar su experiencia de la de otros usuarios, como por ejemplo, el idioma, el número de resultados a mostrar cuando el usuario realiza una búsqueda, el aspecto o contenido del servicio en función del tipo de navegador.",

  advertising: "Publicidad",
  advertisingDescription:
    "Estas cookies, propias o de terceros, almacenan información del comportamiento del usuario obtenida a través de la observación continuada de sus hábitos de navegación (visitas repetidas a un sitio concreto, interacciones, palabras clave, producción de contenidos en línea, etc.), permitiendo desarrollar un perfil específico para mostrar publicidad en función del mismo.",

  // Footer buttons
  rejectAll: "Rechazar todas",
  savePreferences: "Guardar preferencias",

  // Main banner
  bannerTitle: "¡No te olvides de las Cookies!",
  bannerDescription:
    "Utilizamos cookies propias y de terceros para mejorar la funcionalidad de nuestro sitio web, medir el tráfico y la interacción de los usuarios, y optimizar la experiencia de navegación. Estas cookies nos ayudan a analizar el uso del sitio y mantener la seguridad, siempre respetando tu privacidad. Puedes configurar las cookies, rechazar o aceptarlas todas. Este banner permanecerá visible hasta que tomes una decisión. Para más información consulta nuestra",
  cookiePolicy: "Política de Cookies",
  configureCookies: "Configurar Cookies",
  rejectAllCookies: "Rechazar Todas",
  acceptAllCookies: "Aceptar Todas",
  cookiesText: "las cookies",
};

export type Preferences = {
  alreadyChosen: boolean;
  ad_storage: "granted" | "denied"; // Storage for advertising
  analytics_storage: "granted" | "denied"; // Storage for analytics
  functionality_storage: "granted" | "denied"; // Storage for functionality
  personalization_storage: "granted" | "denied"; // Storage for personalization
  security_storage: "granted" | "denied"; // Storage for security
};

export const preferencesState = persistentAtom<Preferences>(
  "cookies-preferences",
  {
    alreadyChosen: false,
    ad_storage: "denied", // Storage for advertising
    analytics_storage: "denied", // Storage for analytics
    functionality_storage: "granted", // Storage for functionality (always required)
    personalization_storage: "denied", // Storage for personalization
    security_storage: "granted", // Storage for security (always required)
  },
  { encode: JSON.stringify, decode: JSON.parse },
);

gtag("consent", "default", {
  ad_storage: "denied",
  analytics_storage: "denied",
  functionality_storage: "granted", // Always required for basic functionality
  personalization_storage: "denied",
  security_storage: "granted", // Always required for security
});

preferencesState.subscribe((newPreferences) => {
  gtag("consent", "update", {
    ad_storage: newPreferences.ad_storage,
    analytics_storage: newPreferences.analytics_storage,
    functionality_storage: newPreferences.functionality_storage,
    personalization_storage: newPreferences.personalization_storage,
    security_storage: newPreferences.security_storage,
  });
});

const grantedAll = () => {
  preferencesState.set({
    alreadyChosen: true,
    ad_storage: "granted",
    analytics_storage: "granted",
    functionality_storage: "granted",
    personalization_storage: "granted",
    security_storage: "granted",
  });
};

const deniedAll = () => {
  preferencesState.set({
    alreadyChosen: true,
    ad_storage: "denied",
    analytics_storage: "denied",
    functionality_storage: "granted", // Always required for basic functionality
    personalization_storage: "denied",
    security_storage: "granted", // Always required for security
  });
};

export const restartPreferences = () => {
  preferencesState.set({
    alreadyChosen: false,
    ad_storage: "denied",
    analytics_storage: "denied",
    functionality_storage: "granted", // Always required for basic functionality
    personalization_storage: "denied",
    security_storage: "granted", // Always required for security
  });
};

function InfoButton({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-1 text-blue-500 hover:text-blue-700"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-left">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button>{dialogs.understood}</Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CookieDialogSettings(
  props: PropsWithChildren<{ className?: string }>,
) {
  const { children, className } = props;

  const preferences = useStore(preferencesState);

  const allAccepted =
    preferences.ad_storage === "granted" &&
    preferences.analytics_storage === "granted" &&
    preferences.functionality_storage === "granted" &&
    preferences.personalization_storage === "granted" &&
    preferences.security_storage === "granted";

  const marketingAccepted = preferences.ad_storage === "granted";
  const statisticsAccepted = preferences.analytics_storage === "granted";
  const preferencesAccepted = preferences.personalization_storage === "granted";
  const functionalityAccepted = preferences.functionality_storage === "granted";
  const securityAccepted = preferences.security_storage === "granted";

  return (
    <aside className={className}>
      <Dialog>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogs.privacyTitle}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[600px] overflow-auto">
            <div className="mb-2">
              <p className="mb-4">
                {dialogs.privacyDescription}{" "}
                <a href="/legal/cookies" className="text-blue-500">
                  {dialogs.cookiesPolicyLink}
                </a>
                .
              </p>
              {!allAccepted && (
                <Button
                  size={"lg"}
                  onClick={() => {
                    grantedAll();
                  }}
                >
                  {dialogs.allowAll}
                </Button>
              )}
            </div>
            <h3 className="text-lg">{dialogs.manageConsent}</h3>
            <div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="necessary">
                  <AccordionTrigger>
                    <span className="flex items-center gap-2">
                      {dialogs.necessary}{" "}
                      <Badge variant="secondary">{dialogs.alwaysActive}</Badge>
                      <InfoButton
                        title={dialogs.infoTitle}
                        description={dialogs.infoDescription}
                      />
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-4">
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          {dialogs.functionality}
                          <Switch checked={functionalityAccepted} disabled />
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          {dialogs.functionalityDescription}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          {dialogs.security}
                          <Switch checked={securityAccepted} disabled />
                        </h4>
                        <p className="text-sm text-gray-600">
                          {dialogs.securityDescription}
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="statistics">
                  <AccordionTrigger>
                    <span>
                      {dialogs.analytics}{" "}
                      {statisticsAccepted && (
                        <Badge variant="secondary">{dialogs.activated}</Badge>
                      )}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-row justify-between gap-4">
                      <p>{dialogs.analyticsDescription}</p>
                      <span>
                        <Switch
                          defaultChecked={
                            preferences.analytics_storage === "granted"
                          }
                          onCheckedChange={(checked) =>
                            preferencesState.set({
                              ...preferencesState.get(),
                              analytics_storage: checked ? "granted" : "denied",
                            })
                          }
                        />
                      </span>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="preferences">
                  <AccordionTrigger>
                    <span>
                      {dialogs.personalization}{" "}
                      {preferencesAccepted && (
                        <Badge variant="secondary">{dialogs.activated}</Badge>
                      )}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-row justify-between gap-4">
                      <p>{dialogs.personalizationDescription}</p>
                      <span>
                        <Switch
                          defaultChecked={
                            preferences.personalization_storage === "granted"
                          }
                          onCheckedChange={(checked) =>
                            preferencesState.set({
                              ...preferencesState.get(),
                              personalization_storage: checked
                                ? "granted"
                                : "denied",
                            })
                          }
                        />
                      </span>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="marketing">
                  <AccordionTrigger>
                    <span>
                      {dialogs.advertising}{" "}
                      {marketingAccepted && (
                        <Badge variant="secondary">{dialogs.activated}</Badge>
                      )}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-row justify-between gap-4">
                      <p>{dialogs.advertisingDescription}</p>
                      <span>
                        <Switch
                          defaultChecked={preferences.ad_storage === "granted"}
                          onCheckedChange={(checked) =>
                            preferencesState.set({
                              ...preferencesState.get(),
                              ad_storage: checked ? "granted" : "denied",
                            })
                          }
                        />
                      </span>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          <DialogFooter>
            <Button
              size={"lg"}
              onClick={() => {
                deniedAll();
              }}
            >
              {dialogs.rejectAll}
            </Button>
            <DialogTrigger
              onClick={() => {
                preferencesState.set({
                  ...preferences,
                  alreadyChosen: true,
                });
              }}
            >
              <Button size={"lg"}>{dialogs.savePreferences}</Button>
            </DialogTrigger>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}

export function CookiesManager() {
  // Skip SSR to avoid hooks being called on server
  if (typeof window === "undefined") {
    return null;
  }

  const alreadyChosen = useStore(preferencesState).alreadyChosen;
  const [open, setOpen] = useState(alreadyChosen === true ? false : true);

  return (
    <>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <aside className="container mx-auto p-4 xl:grid xl:gap-4 xl:grid-cols-[1fr_auto] xl:items-center">
            <div className="max-xl:pb-4">
              <h2 className="text-2xl text-gray-600">{dialogs.bannerTitle}</h2>
              <p className="text-gray-600">
                {dialogs.bannerDescription}{" "}
                <a className="text-blue-400" href="/legal/cookies">
                  {dialogs.cookiePolicy}
                </a>
              </p>
            </div>
            <div className="flex flex-row gap-2 flex-wrap">
              <CookieDialogSettings>
                <Button>{dialogs.configureCookies}</Button>
              </CookieDialogSettings>
              <Button
                onClick={() => {
                  deniedAll();
                  setOpen(false);
                }}
              >
                {dialogs.rejectAllCookies} <span>{dialogs.cookiesText}</span>
              </Button>
              <Button
                onClick={() => {
                  grantedAll();
                  setOpen(false);
                }}
              >
                {dialogs.acceptAllCookies} <span>{dialogs.cookiesText}</span>
              </Button>
            </div>
          </aside>
        </DrawerContent>
      </Drawer>
    </>
  );
}
