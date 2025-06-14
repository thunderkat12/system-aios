
// Secure logging utility that prevents sensitive data exposure
export const secureLog = {
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(message, data);
    }
    // In production, send to secure logging service instead
  },
  
  warn: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(message, data);
    }
    // In production, send to secure logging service instead
  },
  
  error: (message: string, error?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(message, error);
    }
    // In production, log error details securely without exposing to client
  },
  
  audit: (action: string, userId: string, details?: any) => {
    // Always log security-relevant events
    const auditEntry = {
      timestamp: new Date().toISOString(),
      action,
      userId,
      details: process.env.NODE_ENV === 'development' ? details : '[REDACTED]'
    };
    
    if (process.env.NODE_ENV === 'development') {
      console.log('AUDIT:', auditEntry);
    }
    // In production, send to secure audit logging service
  }
};

// Generic error messages for production
export const getGenericErrorMessage = (error: any): string => {
  if (process.env.NODE_ENV === 'development') {
    return error?.message || 'Erro desconhecido';
  }
  
  // Return generic messages in production to prevent information disclosure
  if (error?.code === '23505') {
    return 'Dados duplicados encontrados';
  }
  if (error?.code === '23503') {
    return 'Operação não permitida devido a dependências';
  }
  if (error?.message?.includes('auth')) {
    return 'Erro de autenticação';
  }
  if (error?.message?.includes('permission')) {
    return 'Permissão negada';
  }
  
  return 'Ocorreu um erro interno. Tente novamente.';
};
