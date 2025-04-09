import { Fragment, useState, useRef } from "react"; 
import { useLocation } from "react-router-dom";
import emailjs from '@emailjs/browser';
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import PigeonMap from "./PigeonMap";

const Contact = () => {
  let { pathname } = useLocation();
  const form = useRef();
  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: false,
    message: ''
  });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const sendEmail = (e) => {
    e.preventDefault();
    
    // Validar formulario
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      setStatus({
        submitting: false,
        success: false,
        error: true,
        message: 'Por favor, completa todos los campos'
      });
      return;
    }

    setStatus({
      submitting: true,
      success: false,
      error: false,
      message: ''
    });

    // Usar variables de entorno para las credenciales
    const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    const userId = process.env.REACT_APP_EMAILJS_USER_ID;
    
    // Verificar que las variables de entorno existan
    if (!serviceId || !templateId || !userId) {
      console.error('Faltan credenciales de EmailJS en las variables de entorno');
      setStatus({
        submitting: false,
        success: false,
        error: true,
        message: 'Error de configuración. Por favor, contacta al administrador.'
      });
      return;
    }

    emailjs.sendForm(serviceId, templateId, form.current, userId)
      .then((result) => {
        console.log('Email enviado con éxito:', result.text);
        
        // Enviar evento a Google Analytics
        if (window.dataLayer) {
          window.dataLayer.push({
            'event': 'form_submission',
            'form_name': 'contact_form',
            'submission_result': 'success'
          });
        }
        
        setStatus({
          submitting: false,
          success: true,
          error: false,
          message: '¡Mensaje enviado con éxito! Te contactaremos pronto.'
        });
        
        // Limpiar formulario
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
      })
      .catch((error) => {
        console.log('Error al enviar email:', error.text);
        
        // Enviar evento a Google Analytics
        if (window.dataLayer) {
          window.dataLayer.push({
            'event': 'form_submission',
            'form_name': 'contact_form',
            'submission_result': 'error',
            'error_message': error.text
          });
        }
        
        setStatus({
          submitting: false,
          success: false,
          error: true,
          message: 'Ocurrió un error al enviar el mensaje. Por favor, intenta nuevamente.'
        });
      });
  };

  return (
    <Fragment>
      <SEO
        titleTemplate="Contacto"
        description="Página de contacto del corralón de materiales."
      />
      <LayoutOne>
        {/* breadcrumb */}
        <Breadcrumb 
          pages={[
            {label: "Inicio", path: process.env.PUBLIC_URL + "/" },
            {label: "Contacto", path: process.env.PUBLIC_URL + pathname }
          ]} 
        />
        <div className="contact-area pt-100 pb-100">
          <div className="container">
            <div className="contact-map mb-10">
              <PigeonMap lat={-35.005274270659605} lng={-59.264683908597156} />
            </div>
            <div className="custom-row-2">
              <div className="col-12 col-lg-4 col-md-5">
                <div className="contact-info-wrap">
                  <div className="single-contact-info">
                    <div className="contact-icon">
                      <i className="fa fa-phone" />
                    </div>
                    <div className="contact-info-dec">
                      <p>+054 2227 68-8664</p>
                    </div>
                  </div>
                  <div className="single-contact-info">
                    <div className="contact-icon">
                      <i className="fa fa-map-marker" />
                    </div>
                    <div className="contact-info-dec">
                      <p>Avenida 16, C. 125</p>
                      <p>Navarro, Provincia de Buenos Aires.</p>
                    </div>
                  </div>
                  <div className="contact-social text-center">
                    <h3>Síguenos</h3>
                    <ul>
                      <li>
                        <a href="//instagram.com">
                          <i className="fa fa-instagram" style={{fontSize:"20px"}}/>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-8 col-md-7">
                <div className="contact-form">
                  <div className="contact-title mb-30">
                    <h2>Contáctanos</h2>
                  </div>
                  <form className="contact-form-style" ref={form} onSubmit={sendEmail}>
                    <div className="row">
                      <div className="col-lg-6">
                        <input 
                          name="name" 
                          placeholder="Nombre*" 
                          type="text" 
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-lg-6">
                        <input 
                          name="email" 
                          placeholder="Correo electrónico*" 
                          type="email" 
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-lg-12">
                        <input
                          name="phone"
                          placeholder="Teléfono*"
                          type="text"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-lg-12">
                        <textarea
                          name="message"
                          placeholder="Consulta*"
                          value={formData.message}
                          onChange={handleChange}
                        />
                        <button 
                          className="submit" 
                          type="submit"
                          disabled={status.submitting}
                        >
                          {status.submitting ? 'ENVIANDO...' : 'ENVIAR'}
                        </button>
                      </div>
                    </div>
                  </form>
                  {status.error && (
                    <div className="form-message error-message mt-3">
                      <p>{status.message}</p>
                    </div>
                  )}
                  {status.success && (
                    <div className="form-message success-message mt-3">
                      <p>{status.message}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default Contact;
