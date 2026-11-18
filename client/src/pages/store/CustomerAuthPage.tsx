import React from 'react';
import { AuthPage } from '../../components/auth/AuthPage';

interface CustomerAuthPageProps {
  mode: 'login' | 'register';
}

export const CustomerAuthPage: React.FC<CustomerAuthPageProps> = ({ mode }) => (
  <AuthPage audience="customer" mode={mode} />
);
