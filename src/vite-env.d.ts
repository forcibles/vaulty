/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ANTISTOCK_API_BASE?: string;
  readonly VITE_ANTISTOCK_SHOP_ID?: string;
  readonly VITE_ANTISTOCK_API_KEY?: string;
  readonly VITE_ANTISTOCK_DASH_API_KEY?: string;
  readonly VITE_ANTISTOCK_TEST_PRODUCT_ID?: string;
  readonly VITE_BILLGANG_PRODUCT_ID?: string;
  readonly VITE_STRIPE_PAYMENT_LINK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

type AntistockOpenOptions = {
  slug: string;
  store: string;
};

interface Window {
  Antistock?: {
    open: (options: AntistockOpenOptions) => void;
  };
}
