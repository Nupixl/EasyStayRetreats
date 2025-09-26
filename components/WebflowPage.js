import { useEffect } from "react";
import Head from "next/head";
import Script from "next/script";

const STYLESHEETS = [
  "/webflow/css/normalize.css",
  "/webflow/css/components.css",
  "/webflow/css/easystayretreasts.css",
];

const FONT_PRECONNECTS = [
  { href: "https://fonts.googleapis.com" },
  { href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
];

const INLINE_STYLES = `
  .preloader { display: none !important; }
  .preloader-top { display: none !important; }
  .preloader-bottom { display: none !important; }
  .prloader-fill { display: none !important; }
`;

const WEBFONT_SCRIPT_SRC = "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js";
const WEBFONT_INLINE =
  "WebFont.load({ google: { families: ['Inter:300,regular,500,600,700,800','Poppins:200,200italic,300,300italic,regular,italic,500,500italic,600,700,800,900'] } });";
const TOUCH_DETECTION_INLINE =
  "!function(o,c){var n=c.documentElement,t=' w-mod-';n.className+=t+'js',('ontouchstart'in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+'touch')}(window,document);";
const WEBFLOW_JQUERY_SRC =
  "https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=609dfa12a141dd6e70976d48";
const WEBFLOW_JQUERY_INTEGRITY =
  "sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=";
const WEBFLOW_RUNTIME_SRC = "/webflow/js/easystayretreasts.js";

function toJSONLiteral(value) {
  return JSON.stringify(value ?? "");
}

export default function WebflowPage({ title, description, bodyHtml, pageId, siteId }) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (pageId) {
      document.documentElement.setAttribute("data-wf-page", pageId);
    }
    if (siteId) {
      document.documentElement.setAttribute("data-wf-site", siteId);
    }
  }, [pageId, siteId]);

  return (
    <>
      <Head>
        <title>{title}</title>
        {description ? <meta name="description" content={description} /> : null}
        {FONT_PRECONNECTS.map(({ href, crossOrigin }) => (
          <link key={href} rel="preconnect" href={href} crossOrigin={crossOrigin} />
        ))}
        {STYLESHEETS.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
        <style>{INLINE_STYLES}</style>
      </Head>
      {(pageId || siteId) && (
        <Script
          id="webflow-data-attributes"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              document.documentElement.setAttribute('data-wf-page', ${toJSONLiteral(
                pageId
              )});
              document.documentElement.setAttribute('data-wf-site', ${toJSONLiteral(
                siteId
              )});
            `,
          }}
        />
      )}
      <Script src={WEBFONT_SCRIPT_SRC} strategy="beforeInteractive" />
      <Script
        id="webflow-webfont-loader"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: WEBFONT_INLINE }}
      />
      <Script
        id="webflow-touch-loader"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: TOUCH_DETECTION_INLINE }}
      />
      <Script
        src={WEBFLOW_JQUERY_SRC}
        strategy="beforeInteractive"
        integrity={WEBFLOW_JQUERY_INTEGRITY}
        crossOrigin="anonymous"
      />
      <div
        className="webflow-page-wrapper"
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
        suppressHydrationWarning
      />
      <Script src={WEBFLOW_RUNTIME_SRC} strategy="afterInteractive" />
      <Script
        id="webflow-interactions-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html:
            "if (window.Webflow && window.Webflow.require) { try { window.Webflow.require('ix2').init(); } catch (e) { console.warn('Webflow IX init failed', e); } }",
        }}
      />
    </>
  );
}
