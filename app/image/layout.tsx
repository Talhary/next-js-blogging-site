"use client";

import { ReCaptchaProvider } from "next-recaptcha-v3";

const RootLayout = ({ children }) => {
  return (
    <ReCaptchaProvider reCaptchaKey="6LegVo4qAAAAAG7vnlh2RflWsfi-9q5mBZGQ6Bzy">
      {children}
    </ReCaptchaProvider>
  );
};

export default RootLayout;
