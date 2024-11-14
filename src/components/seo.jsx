import PropTypes from "prop-types";
import { Helmet, HelmetProvider } from "react-helmet-async";

const SEO = ({ title, titleTemplate, description }) => {
    return (
        <HelmetProvider>
            <Helmet>
                <meta charSet="utf-8" />
                <title>
                    {title} | {titleTemplate}
                </title>
                <meta name="description" content={description} />
            </Helmet>
        </HelmetProvider>
    );
};

SEO.propTypes = {
    title: PropTypes.string,
    titleTemplate: PropTypes.string,
    description: PropTypes.string,
}

SEO.defaultProps = {
    title: "Corralon de Materiales Don Mauricio",
    titleTemplate: "Materiales de Construcción en Navarro, Buenos Aires",
    description: "Encuentra los mejores materiales de construcción en Don Mauricio, ubicado en Navarro, Buenos Aires. Ofrecemos una amplia variedad de productos para todas tus necesidades de construcción.",
};

export default SEO;