import Navbar from "../../components/navbar";

export const metadata = {
    title: "Login - Cidaga App",
    description: "Cimahi Pilkada Siaga",
    icons: {
      icon: "/cimahi.ico",
      shortcut: "/cimahi.ico",
      apple: "/cimahi.ico",
    },
};
  
export default function RootLayout({ children }) {
    return (
      <div className="login-layout min-h-screen">
        <Navbar />
        <div className="w-full">
          {children}
        </div>
      </div>
    );
}
