import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Settings, Webhook, Zap, TestTube } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const isMobile = useIsMobile();
  const [webhookUrl, setWebhookUrl] = useState("");
  const [n8nUrl, setN8nUrl] = useState("");
  const [n8nApiKey, setN8nApiKey] = useState("");
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [isTestingN8n, setIsTestingN8n] = useState(false);

  const handleTestWebhook = async () => {
    if (!webhookUrl) {
      toast({
        title: "Erro",
        description: "Insira a URL do webhook",
        variant: "destructive"
      });
      return;
    }

    setIsTestingWebhook(true);
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          test: true,
          timestamp: new Date().toISOString(),
          message: "Teste de webhook do CRM"
        }),
      });

      toast({
        title: "Webhook Testado",
        description: "Requisição enviada com sucesso. Verifique os logs do seu webhook.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao testar webhook. Verifique a URL.",
        variant: "destructive"
      });
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const handleTestN8n = async () => {
    if (!n8nUrl) {
      toast({
        title: "Erro",
        description: "Insira a URL do N8N",
        variant: "destructive"
      });
      return;
    }

    setIsTestingN8n(true);
    try {
      const response = await fetch(`${n8nUrl}/webhook/test-crm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": n8nApiKey ? `Bearer ${n8nApiKey}` : ""
        },
        mode: "no-cors",
        body: JSON.stringify({
          test: true,
          timestamp: new Date().toISOString(),
          message: "Teste de integração N8N do CRM"
        }),
      });

      toast({
        title: "N8N Testado",
        description: "Requisição enviada com sucesso. Verifique os logs do N8N.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao testar N8N. Verifique a URL e API key.",
        variant: "destructive"
      });
    } finally {
      setIsTestingN8n(false);
    }
  };

  const handleSaveWebhook = () => {
    localStorage.setItem('crm-webhook-url', webhookUrl);
    toast({
      title: "Sucesso",
      description: "Configurações do webhook salvas"
    });
  };

  const handleSaveN8n = () => {
    localStorage.setItem('crm-n8n-url', n8nUrl);
    localStorage.setItem('crm-n8n-api-key', n8nApiKey);
    toast({
      title: "Sucesso",
      description: "Configurações do N8N salvas"
    });
  };

  // Carrega configurações salvas ao inicializar
  useState(() => {
    const savedWebhookUrl = localStorage.getItem('crm-webhook-url');
    const savedN8nUrl = localStorage.getItem('crm-n8n-url');
    const savedN8nApiKey = localStorage.getItem('crm-n8n-api-key');
    
    if (savedWebhookUrl) setWebhookUrl(savedWebhookUrl);
    if (savedN8nUrl) setN8nUrl(savedN8nUrl);
    if (savedN8nApiKey) setN8nApiKey(savedN8nApiKey);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Configure integrações e automações do CRM
          </p>
        </div>
      </div>

      <Tabs defaultValue="webhook" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="webhook">Webhooks</TabsTrigger>
          <TabsTrigger value="n8n">N8N Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="webhook" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                <CardTitle>Configuração de Webhook</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-url">URL do Webhook</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://seu-webhook.com/endpoint"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Esta URL será chamada quando eventos importantes acontecerem no CRM (novos leads, agendamentos, etc.)
                </p>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveWebhook}>
                  Salvar Configurações
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleTestWebhook}
                  disabled={isTestingWebhook}
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  {isTestingWebhook ? "Testando..." : "Testar Webhook"}
                </Button>
              </div>

              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-medium mb-2">Eventos que ativam o webhook:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Novo lead adicionado</li>
                  <li>• Lead atualizado</li>
                  <li>• Agendamento realizado</li>
                  <li>• Status do lead alterado</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="n8n" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                <CardTitle>Integração N8N</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="n8n-url">URL do N8N</Label>
                <Input
                  id="n8n-url"
                  placeholder="https://seu-n8n.com"
                  value={n8nUrl}
                  onChange={(e) => setN8nUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="n8n-api-key">API Key do N8N (Opcional)</Label>
                <Input
                  id="n8n-api-key"
                  type="password"
                  placeholder="n8n_api_key_xxxxxxxxxxxx"
                  value={n8nApiKey}
                  onChange={(e) => setN8nApiKey(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  API Key para autenticação se necessário
                </p>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveN8n}>
                  Salvar Configurações
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleTestN8n}
                  disabled={isTestingN8n}
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  {isTestingN8n ? "Testando..." : "Testar N8N"}
                </Button>
              </div>

              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-medium mb-2">Como configurar no N8N:</h4>
                <ol className="text-sm space-y-1 text-muted-foreground">
                  <li>1. Crie um workflow no N8N</li>
                  <li>2. Adicione um trigger "Webhook"</li>
                  <li>3. Configure o endpoint como "/webhook/test-crm"</li>
                  <li>4. Adicione as automações desejadas</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}