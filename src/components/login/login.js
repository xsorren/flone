import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import styled from 'styled-components';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 20px;
`;

const LoginCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 400px;
  padding: 40px;
  transition: transform 0.3s ease;
  
  @media (max-width: 480px) {
    padding: 30px 20px;
  }
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #2c3e50;
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 10px 0;
`;

const Subtitle = styled.p`
  color: #7f8c8d;
  font-size: 16px;
  margin: 0;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #34495e;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 16px;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    outline: none;
  }
  
  &::placeholder {
    color: #bdc3c7;
  }
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  
  &:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            
            if (error) {
                throw error;
            } else {
                // Supabase guarda el session token internamente. 
                navigate('/products');
            }
        } catch (error) {
            console.error(error);
            setError('Credenciales inválidas');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LoginContainer>
            <LoginCard>
                <LoginHeader>
                    <Title>Bienvenido</Title>
                    <Subtitle>Inicia sesión para continuar</Subtitle>
                </LoginHeader>
                
                {error && (
                    <div style={{ 
                        backgroundColor: '#ffebee', 
                        color: '#c62828', 
                        padding: '10px', 
                        borderRadius: '4px', 
                        marginBottom: '20px',
                        fontSize: '14px',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}
                
                <LoginForm onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="tucorreo@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </FormGroup>
                    
                    <FormGroup>
                        <Label htmlFor="password">Contraseña</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </FormGroup>
                    
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </Button>
                </LoginForm>
            </LoginCard>
        </LoginContainer>
    );
};

export default Login;
