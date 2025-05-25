import NavbarAdmin from "../components/admin/navbar-admin";

export const metadata = {
  title: "Admin Input - Cidaga App",
  description: "Cimahi Pilkada Siaga",
  icons: {
    icon: "/cimahi.ico",
    shortcut: "/cimahi.ico",
    apple: "/cimahi.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <div className="admin-layout min-h-screen bg-gradient-to-b from-gray-100 to-white ">
      <NavbarAdmin />
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
