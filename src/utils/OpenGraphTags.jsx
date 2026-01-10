import React from "react";

const OpenGraphTags = () => {
  return (
    <React.Fragment>
      <meta
        property="og:url"
        content="https://idrisbookbank-admin.inara.tech"
      />
      {/* thumbnail And title for social media */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Idris Book Bank | Online Book Store | Admin Panel" />
      <meta
        property="og:description"
        content="Idris Book Bank Admin Panel."
      />
      <meta property="og:image" content="/assets/images/landing/image-preview.png" />
    </React.Fragment>
  );
};

export default OpenGraphTags;
