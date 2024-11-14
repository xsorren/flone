import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MobileNavMenu = () => {
  const { t } = useTranslation();

  return (
    <nav className="offcanvas-navigation" id="offcanvas-navigation">
      <ul>
        <li>
          <Link to={process.env.PUBLIC_URL + "/"}>{t("Inicio")}</Link>
        </li>
        <li>
          <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>{t("Catálogo")}</Link>
        </li>
        <li>
          <Link to={process.env.PUBLIC_URL + "/contact"}>{t("Contactanos")}</Link>
        </li>
      </ul>
    </nav>
  );
};

export default MobileNavMenu;
