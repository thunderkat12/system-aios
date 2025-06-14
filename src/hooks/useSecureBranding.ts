
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface BrandingSettings {
  companyName: string;
  companyLogo: string;
  primaryColor: string;
  secondaryColor: string;
}

const DEFAULT_BRANDING: BrandingSettings = {
  companyName: 'HiTech',
  companyLogo: '',
  primaryColor: '#2563eb',
  secondaryColor: '#64748b'
};

export function useSecureBranding() {
  const [branding, setBranding] = useState<BrandingSettings>(DEFAULT_BRANDING);
  const [isLoading, setIsLoading] = useState(false);
  const { userProfile } = useAuth();

  useEffect(() => {
    loadBranding();
  }, []);

  const loadBranding = () => {
    try {
      const savedBranding = localStorage.getItem('branding-settings');
      if (savedBranding) {
        const parsed = JSON.parse(savedBranding);
        setBranding(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.log('Error loading branding settings');
    }
  };

  const updateBranding = async (newBranding: Partial<BrandingSettings>, password: string) => {
    // Only admins can update branding
    if (!userProfile || userProfile.role !== 'admin') {
      throw new Error('Acesso negado: apenas administradores podem alterar configurações');
    }

    // Simple password validation (in production, this should be more secure)
    if (password !== 'admin2024') {
      throw new Error('Senha incorreta');
    }

    try {
      setIsLoading(true);
      const updatedBranding = { ...branding, ...newBranding };
      
      // Save to localStorage (in production, save to secure backend)
      localStorage.setItem('branding-settings', JSON.stringify(updatedBranding));
      setBranding(updatedBranding);
      
      return { success: true };
    } catch (error) {
      throw new Error('Erro ao salvar configurações');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    branding,
    isLoading,
    updateBranding,
    canEdit: userProfile?.role === 'admin'
  };
}
