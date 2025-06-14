
import { useState } from "react";
import { useBranding } from "@/hooks/useBranding";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function BrandingSettings({ onDone }: { onDone?: () => void }) {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const { branding, saveBranding } = useBranding();
  const [localData, setLocalData] = useState({
    appName: branding.appName,
    primaryColor: branding.primaryColor,
  });
  const [saved, setSaved] = useState(false);

  const handlePassword = () => {
    if (password === "14251524") setUnlocked(true);
    else alert("Senha incorreta");
  };

  const handleChange = (e: any) => {
    setLocalData({ ...localData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    saveBranding({ ...localData });
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
    if (onDone) onDone();
  };

  if (!unlocked) {
    return (
      <div className="max-w-sm mx-auto mt-12 bg-card p-6 rounded-xl shadow border">
        <div className="mb-3 text-lg font-bold">Protegido</div>
        <div className="mb-3">Digite a senha de administrador para acessar configuração de marca:</div>
        <Input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Senha"
          onKeyDown={e => e.key === "Enter" && handlePassword()}
        />
        <Button className="mt-4 w-full" onClick={handlePassword}>Entrar</Button>
        <div className="mt-2 text-xs text-muted-foreground">Senha padrão: <b>14251524</b></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-card p-6 rounded-xl shadow border animate-in">
      <h2 className="font-semibold text-xl mb-3">Configurações de Marca</h2>
      <div className="mb-4">
        <label className="block mb-1 font-medium" htmlFor="appName">Nome do App</label>
        <Input
          name="appName"
          id="appName"
          value={localData.appName}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium" htmlFor="primaryColor">Cor Primária</label>
        <Input
          name="primaryColor"
          id="primaryColor"
          type="color"
          value={localData.primaryColor}
          onChange={handleChange}
          style={{ width: "60px", padding: 0 }}
        />
        <span className="ml-3">{localData.primaryColor}</span>
      </div>
      <Button className="w-full" onClick={handleSave}>Salvar Configuração</Button>
      {saved && <div className="mt-2 text-green-600">Salvo!</div>}
      <div className="mt-3 text-xs text-muted-foreground">
        Ao salvar, o nome e a cor do app será atualizado imediatamente.<br />
        Para revender: acesse este local e personalize para o novo cliente!
      </div>
      <Button variant="ghost" className="mt-4 text-xs" onClick={onDone}>Voltar</Button>
    </div>
  );
}
