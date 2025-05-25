import LayoutWrapper from "../components/superadmin/layout-wrapper";

export const metadata = {
  title: "Superadmin - Cidaga",
  description: "Superadmin Dashboard",
  icons: {
    icon: "/cimahi.ico",
    shortcut: "/cimahi.ico",
    apple: "/cimahi.ico",
  },
};

export default function SuperadminLayout({ children }) {
  return <LayoutWrapper>{children}</LayoutWrapper>;
}
