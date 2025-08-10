import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DEMO_MODE } from '@/config';

interface LogData {
  acao: string;
  detalhes?: any;
  escola_id?: string;
  user_id?: string;
}

export const useSecurityLogger = () => {
  const getUserInfo = useCallback(() => {
    const userAgent = navigator.userAgent;
    const getIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
      } catch (error) {
        console.error('Error getting IP:', error);
        return 'unknown';
      }
    };
    
    return { userAgent, getIP };
  }, []);

  const logAction = useCallback(async (logData: LogData) => {
    try {
      if (DEMO_MODE) {
        console.log('[DemoMode] logAction', logData);
        return;
      }
      const { userAgent, getIP } = getUserInfo();
      const ip = await getIP();
      
      const { error } = await supabase.rpc('log_action', {
        p_user_id: logData.user_id || null,
        p_escola_id: logData.escola_id || null,
        p_acao: logData.acao,
        p_detalhes: logData.detalhes || {},
        p_ip_address: ip,
        p_user_agent: userAgent
      });

      if (error) {
        console.error('Error logging action:', error);
      }
    } catch (error) {
      console.error('Error in logAction:', error);
    }
  }, [getUserInfo]);

  const logSessionAttempt = useCallback(async (
    escolaId: string | null, 
    alunoNome: string | null, 
    success: boolean
  ) => {
    try {
      if (DEMO_MODE) {
        console.log('[DemoMode] logSessionAttempt', { escolaId, alunoNome, success });
        return;
      }
      const { userAgent, getIP } = getUserInfo();
      const ip = await getIP();
      
      const { error } = await supabase
        .from('sessoes_monitoramento')
        .insert({
          escola_id: escolaId,
          aluno_nome: alunoNome,
          ip_address: ip,
          user_agent: userAgent,
          tentativa_sucesso: success
        });

      if (error) {
        console.error('Error logging session attempt:', error);
      }
    } catch (error) {
      console.error('Error in logSessionAttempt:', error);
    }
  }, [getUserInfo]);

  return {
    logAction,
    logSessionAttempt
  };
};