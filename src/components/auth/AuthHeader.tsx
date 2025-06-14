
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench } from 'lucide-react';

export function AuthHeader() {
  return (
    <CardHeader className="text-center">
      <div className="flex justify-center mb-4">
        <div className="bg-primary rounded-full p-3">
          <Wrench className="h-8 w-8 text-white" />
        </div>
      </div>
      <CardTitle className="text-2xl font-bold">Hi-Tech Soluções</CardTitle>
      <CardDescription>
        Sistema de Gerenciamento de Ordens de Serviço
      </CardDescription>
    </CardHeader>
  );
}
