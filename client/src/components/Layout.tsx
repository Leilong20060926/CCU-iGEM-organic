import { Outlet } from "react-router-dom";
import Banner from "./Banner";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="mx-auto flex min-h-screen max-w-[1240px] flex-col bg-paper shadow-[0_0_60px_rgba(51,44,28,0.08)]">
      <Banner />
      <main className="mx-auto w-full max-w-[1080px] flex-1 px-8 py-6.5 max-[720px]:px-4.5">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
