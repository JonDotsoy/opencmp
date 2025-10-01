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
  console.log("gtag", args);
};

export type Preferences = {
  alreadyChosen: boolean;
  ad_storage: "granted" | "denied"; // Storage for advertising
  analytics_storage: "granted" | "denied"; // Storage for analytics
  functionality_storage: "granted" | "denied"; // Storage for functionality
  personalization_storage: "granted" | "denied"; // Storage for personalization
  security_storage: "granted" | "denied"; // Storage for security
};

const preferencesState = persistentAtom<Preferences>(
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
  if (newPreferences.alreadyChosen) {
    gtag("consent", "update", {
      ad_storage: newPreferences.ad_storage,
      analytics_storage: newPreferences.analytics_storage,
      functionality_storage: newPreferences.functionality_storage,
      personalization_storage: newPreferences.personalization_storage,
      security_storage: newPreferences.security_storage,
    });
  }
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
            <Button>Entendido</Button>
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
            <DialogTitle>Centro de preferencias de la privacidad</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="mb-2">
            <p className="mb-4">
              A continuación te mostramos el detalle de las cookies que tenemos
              en la web de Universia Holding. La información la encontrarás
              detallada en relación con la finalidad de las cookies. Podrás
              configurar o instalar aquellas que consideres adecuadas o
              rechazarlas todas. Recuerda que las cookies técnicas se instalarán
              siempre ya que sin ellas la web no puede funcionar correctamente.
              Haz clic en los encabezados de cada categoría para saber más y
              cambiar la configuración como desees. Sin embargo, ten en cuenta
              que el bloqueo de algunos tipos de cookies puede afectar su
              experiencia en el sitio y los servicios que podemos ofrecer. Puede
              consultar nuestra política de cookies en cualquier momento en la
              Web o{" "}
              <a href="/legal/cookies" className="text-blue-500">
                aquí
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
                Permitir todas
              </Button>
            )}
          </div>
          <h3 className="text-lg">
            Gestionar las preferencias de consentimiento
          </h3>
          <div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="necessary">
                <AccordionTrigger>
                  <span className="flex items-center gap-2">
                    Necesarias{" "}
                    <Badge variant="secondary">Siempre activadas</Badge>
                    <InfoButton
                      title="¿Por qué las cookies necesarias siempre están activas?"
                      description="Las cookies necesarias incluyen tanto cookies de funcionalidad como de seguridad que son absolutamente esenciales para el funcionamiento del sitio web. Las de funcionalidad permiten navegación, formularios y características interactivas. Las de seguridad protegen contra amenazas cibernéticas, verifican identidad y mantienen sesiones seguras. Están clasificadas como 'estrictamente necesarias' según GDPR/CCPA y no requieren consentimiento explícito ya que son indispensables para el servicio básico."
                    />
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        🔧 Funcionalidad
                        <Switch checked={functionalityAccepted} disabled />
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Cookies esenciales para el correcto funcionamiento de
                        las características del sitio web. Permiten funciones
                        básicas como la navegación por páginas, el acceso a
                        áreas seguras, y la utilización de características
                        interactivas.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        🔒 Seguridad
                        <Switch checked={securityAccepted} disabled />
                      </h4>
                      <p className="text-sm text-gray-600">
                        Cookies críticas para la seguridad del sitio web y la
                        protección de los usuarios. Incluyen identificación de
                        sesiones, prevención de ataques, autenticación de
                        usuarios y protección contra accesos no autorizados.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="statistics">
                <AccordionTrigger>
                  <span>
                    Analíticas{" "}
                    {statisticsAccepted && (
                      <Badge variant="secondary">Activadas</Badge>
                    )}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-row justify-between gap-4">
                    <p>
                      Estas cookies, propias o de terceros, responden al
                      objetivo de obtener información sobre el rendimiento del
                      sitio y la utilización del mismo por parte del usuario,
                      como por ejemplo, realizar la medición y análisis de cómo
                      llegan los usuarios al sitio y qué uso hacen del mismo.
                      Asimismo, utilizamos estas cookies para elaborar modelos
                      analíticos sobre la base de tu perfil comercial.
                    </p>
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
                    Personalización{" "}
                    {preferencesAccepted && (
                      <Badge variant="secondary">Activadas</Badge>
                    )}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-row justify-between gap-4">
                    <p>
                      Estas cookies permiten recordar información para que el
                      usuario acceda al servicio con determinadas
                      características que pueden diferenciar su experiencia de
                      la de otros usuarios, como por ejemplo, el idioma, el
                      número de resultados a mostrar cuando el usuario realiza
                      una búsqueda, el aspecto o contenido del servicio en
                      función del tipo de navegador.
                    </p>
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
                    Publicidad{" "}
                    {marketingAccepted && (
                      <Badge variant="secondary">Activadas</Badge>
                    )}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-row justify-between gap-4">
                    <p>
                      Estas cookies, propias o de terceros, almacenan
                      información del comportamiento del usuario obtenida a
                      través de la observación continuada de sus hábitos de
                      navegación (visitas repetidas a un sitio concreto,
                      interacciones, palabras clave, producción de contenidos en
                      línea, etc.), permitiendo desarrollar un perfil específico
                      para mostrar publicidad en función del mismo.
                    </p>
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
          <DialogFooter>
            <Button
              size={"lg"}
              onClick={() => {
                deniedAll();
              }}
            >
              Rechazar todas
            </Button>
            <DialogTrigger
              onClick={() => {
                preferencesState.set({
                  ...preferences,
                  alreadyChosen: true,
                });
              }}
            >
              <Button size={"lg"}>Guardar preferencias</Button>
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
              <h2 className="text-2xl text-gray-600">
                ¡No te olvides de las Cookies!
              </h2>
              <p className="text-gray-600">
                Para Universia Holding es importante adaptarse a tus gustos y
                preferencias, para ello usamos cookies propias y de terceros que
                nos permiten medir el volumen y la interacción de los usuarios
                en la web y nos ayudan a mejorarla, permitiéndonos analizar tus
                hábitos y elaborar perfiles de navegación, respetando en todo
                caso tu privacidad. Puedes configurar las cookies, rechazar o
                aceptarlas todas. Este banner se mantendrá activo hasta que
                ejecutes una de las tres opciones. Para más información consulta
                nuestra{" "}
                <a className="text-blue-400" href="/legal/cookies">
                  Política de Cookies
                </a>
              </p>
            </div>
            <div className="flex flex-row gap-2">
              <CookieDialogSettings>
                <Button>Configurar Cookies</Button>
              </CookieDialogSettings>
              <Button
                onClick={() => {
                  deniedAll();
                  setOpen(false);
                }}
              >
                Rechazar Todas <span>las cookies</span>
              </Button>
              <Button
                onClick={() => {
                  grantedAll();
                  setOpen(false);
                }}
              >
                Aceptar Todas <span>las cookies</span>
              </Button>
            </div>
          </aside>
        </DrawerContent>
      </Drawer>
    </>
  );
}
