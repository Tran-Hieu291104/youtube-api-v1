import { ReactNode } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

interface HelmetProviderProps {
  children: ReactNode;
}

const PageMeta = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
  </Helmet>
);

export const AppWrapper = ({ children }: HelmetProviderProps) => (
  <HelmetProvider>{children}</HelmetProvider>
);

export default PageMeta;
