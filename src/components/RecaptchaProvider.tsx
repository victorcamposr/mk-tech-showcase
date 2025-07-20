
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { ReactNode } from 'react';

interface RecaptchaProviderProps {
  children: ReactNode;
}

const RecaptchaProvider = ({ children }: RecaptchaProviderProps) => {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey="6Ld5cokrAAAAAJVBkW9MDFYuA0sL7yRBhFgCzRi_"
      scriptProps={{
        async: false,
        defer: false,
        appendTo: "head",
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
};

export default RecaptchaProvider;
