import Head from "next/head";
import Script from "next/script";
import { useEffect } from "react";
import { getWebflowHomepage } from "../lib/webflow";

const extractBody = (html) => {
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return match ? match[1] : html;
};

export async function getStaticProps() {
  const rawHtml = getWebflowHomepage();
  const bodyContent = extractBody(rawHtml);

  return {
    props: {
      html: bodyContent,
    },
    revalidate: 60,
  };
}

const LocalHomepage = ({ html }) => {
  useEffect(() => {
    if (typeof document === "undefined") return;

    document.documentElement.setAttribute("data-wf-page", "68bf2bda93c9381ef9e6ed91");
    document.documentElement.setAttribute("data-wf-site", "609dfa12a141dd6e70976d48");

    const initialiseWebflow = () => {
      if (typeof window === "undefined") return;
      const { Webflow } = window;
      if (Webflow && typeof Webflow.require === "function") {
        try {
          Webflow.ready && Webflow.ready();
          const ix2 = Webflow.require("ix2");
          ix2 && typeof ix2.init === "function" && ix2.init();
        } catch (error) {
          console.warn("Webflow interactions init failed", error);
        }
      }

      const preloader = document.querySelector(".preloader");
      if (preloader) {
        preloader.setAttribute("style", "display:none !important");
      }
      document.body.style.removeProperty("overflow");
    };

    initialiseWebflow();
    window.addEventListener("load", initialiseWebflow);

    return () => window.removeEventListener("load", initialiseWebflow);
  }, [html]);

  return (
    <>
      <Head>
        <title>Easy Stay Property Management | Stress-Free Hosting &amp; More Bookings</title>
        <meta
          name="description"
          content="Turn your home into a vacation rental with Easy Stay. We handle guest communication, 24/7 support, cleaning, and finances—so you earn more and stress less."
        />
        <meta
          property="og:title"
          content="Easy Stay Property Management | Stress-Free Hosting &amp; More Bookings"
        />
        <meta
          property="og:description"
          content="Turn your home into a vacation rental with Easy Stay. We handle guest communication, 24/7 support, cleaning, and finances—so you earn more and stress less."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Easy Stay Property Management | Stress-Free Hosting &amp; More Bookings"
        />
        <meta
          name="twitter:description"
          content="Turn your home into a vacation rental with Easy Stay. We handle guest communication, 24/7 support, cleaning, and finances—so you earn more and stress less."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/webflow/css/normalize.css" />
        <link rel="stylesheet" href="/webflow/css/components.css" />
        <link rel="stylesheet" href="/webflow/css/easystayretreasts.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="shortcut icon" href="/webflow/images/favicon.png" />
        <link rel="apple-touch-icon" href="/webflow/images/webclip.png" />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; }
          html, body { margin: 0; padding: 0; }
          img { max-width: 100%; height: auto; display: block; }
          a { color: inherit; text-decoration: none; }
          button, input, textarea { font: inherit; }
        `}</style>
      </Head>
      <Script
        src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
        strategy="beforeInteractive"
      />
      <Script
        id="webflow-webfont"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html:
            "WebFont.load({ google: { families: [\"Inter:300,regular,500,600,700,800\",\"Poppins:200,200italic,300,300italic,regular,italic,500,500italic,600,700,800,900\"] } });",
        }}
      />
      <Script
        id="webflow-touch"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html:
            "!function(o,c){var n=c.documentElement,t=' w-mod-';n.className+=t+'js',('ontouchstart'in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+'touch')}(window,document);",
        }}
      />
      <Script
        src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=609dfa12a141dd6e70976d48"
        strategy="beforeInteractive"
        integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0="
        crossOrigin="anonymous"
      />
      <Script
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD8v_6yM27IK1EqjrA9zQKsl5XyoQmA92Q&libraries=places"
        strategy="afterInteractive"
      />
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <Script src="/webflow/js/easystayretreasts.js" strategy="afterInteractive" />
      <Script
        id="webflow-search-handler"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: [
            "(function(){",
            "  const loc = document.getElementById('es-location');",
            "  const cin = document.getElementById('es-checkin');",
            "  const cout = document.getElementById('es-checkout');",
            "  const guests = document.getElementById('es-guests');",
            "  const btn = document.getElementById('es-search-btn');",
            "  if(!loc || !cin || !cout || !guests || !btn){ return; }",
            "  const fmt = d => d.toISOString().slice(0,10);",
            "  const today = new Date();",
            "  const tomorrow = new Date(today.getTime() + 86400000);",
            "  cin.value = fmt(today);",
            "  cout.value = fmt(tomorrow);",
            "  cin.min = fmt(today);",
            "  cout.min = fmt(tomorrow);",
            "  cin.addEventListener('change', () => {",
            "    const ci = new Date(cin.value);",
            "    const coMin = new Date(ci.getTime() + 86400000);",
            "    if(new Date(cout.value) <= ci) cout.value = fmt(coMin);",
            "    cout.min = fmt(coMin);",
            "  });",
            "  btn.addEventListener('click', () => {",
            "    const params = new URLSearchParams({",
            "      q: loc.value.trim(),",
            "      checkin: cin.value,",
            "      checkout: cout.value,",
            "      guests: guests.value || '1'",
            "    });",
            "    window.location.href = '/search?' + params.toString();",
            "  });",
            "})();"
          ].join('\n'),
        }}
      />
      <Script
        id="webflow-google-autocomplete"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
window.addEventListener('load', () => {
  if (window.google && google.maps && google.maps.places) {
    const input = document.getElementById('es-location');
    if (input) {
      const options = { types: ['(cities)'] };
      const autocomplete = new google.maps.places.Autocomplete(input, options);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place && place.formatted_address) {
          input.value = place.formatted_address;
        } else if (place && place.name) {
          input.value = place.name;
        }
      });
    }
  }
});
        `,
        }}
      />
    </>
  );
};

export default LocalHomepage;
