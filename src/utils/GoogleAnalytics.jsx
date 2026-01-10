import Script from "next/script";
import React from "react";

const GoogleAnalytics = () => {
  return (
    <>
      {/* Google analytics */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-FLCDXWTVMD"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-FLCDXWTVMD');
          `,
        }}
      />
    </>
  );
};

export default GoogleAnalytics;
