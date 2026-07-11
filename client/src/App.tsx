import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LangProvider } from "./context/LangContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import CropListPage from "./pages/CropListPage";
import OperatorListPage from "./pages/OperatorListPage";
import OperatorDetailPage from "./pages/OperatorDetailPage";
import MapPage from "./pages/MapPage";
import AboutPage from "./pages/AboutPage";
import InfoPage from "./pages/InfoPage";

function App() {
  return (
    <LangProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="category/:catId" element={<CategoryPage />} />
            <Route path="category/:catId/crops" element={<CropListPage />} />
            <Route path="category/:catId/crop/:crop" element={<OperatorListPage />} />
            <Route path="category/:catId/:sub" element={<CropListPage />} />
            <Route path="category/:catId/:sub/crop/:crop" element={<OperatorListPage />} />
            <Route path="search" element={<OperatorListPage />} />
            <Route path="operator/:id" element={<OperatorDetailPage />} />
            <Route path="map" element={<MapPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="info" element={<InfoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LangProvider>
  );
}

export default App;
