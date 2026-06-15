'use client';

import { motion } from 'framer-motion';
import { Mail, Globe, Eye, ExternalLink, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CampaignDetail } from '@/store/campaign.store';
import { apiService } from '@/app/services/api.service';

interface CampaignTemplatePreviewProps {
  campaign: CampaignDetail;
}

export function CampaignTemplatePreview({ campaign }: CampaignTemplatePreviewProps) {
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [showLandingPreview, setShowLandingPreview] = useState(false);
  const [emailTemplateHtml, setEmailTemplateHtml] = useState<string>('');
  const [landingTemplateHtml, setLandingTemplateHtml] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const [isLoadingLanding, setIsLoadingLanding] = useState(false);

  // Charger le template email complet
  const loadEmailTemplate = async () => {
    if (!campaign.emailTemplateId || emailTemplateHtml) return;
    
    setIsLoadingEmail(true);
    try {
      const response = await apiService.get<any>(`/templates/${campaign.emailTemplateId}`);
      const template = response.data ?? response;
      setEmailTemplateHtml(template.html || '');
      setEmailSubject(template.subject || '');
    } catch (error) {
      console.error('Erreur lors du chargement du template email', error);
    } finally {
      setIsLoadingEmail(false);
    }
  };

  // Charger le template landing page complet
  const loadLandingTemplate = async () => {
    if (!campaign.landingPageTemplateId || landingTemplateHtml) return;
    
    setIsLoadingLanding(true);
    try {
      const response = await apiService.get<any>(`/landing-page-templates/${campaign.landingPageTemplateId}`);
      const template = response.data ?? response;
      setLandingTemplateHtml(template.html || '');
    } catch (error) {
      console.error('Erreur lors du chargement du template landing page', error);
    } finally {
      setIsLoadingLanding(false);
    }
  };

  useEffect(() => {
    if (showEmailPreview) {
      loadEmailTemplate();
    }
  }, [showEmailPreview]);

  useEffect(() => {
    if (showLandingPreview) {
      loadLandingTemplate();
    }
  }, [showLandingPreview]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Email Template */}
      <Card className="rounded-md border border-white/10 bg-white  dark:bg-[#0c1023]/90  ">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-sm bg-blue-500/20 p-3">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-gray-900 dark:text-white">Template Email</CardTitle>
                <CardDescription className="text-sm text-zinc-400">
                  {campaign.emailTemplate?.name || 'N/A'}
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={() => setShowEmailPreview(!showEmailPreview)}
              size="sm"
              variant="outline"
              className="border-blue-500/30 text-gray-900 dark:text-white hover:text-gray-900 dark:text-white bg-blue-500/10   hover:bg-blue-500/20"
            >
              <Eye className="w-4 h-4 mr-2" />
              {showEmailPreview ? 'Masquer' : 'Aperçu'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-zinc-500 mb-1">De</p>
            <p className="text-sm text-gray-900 dark:text-white">
              {campaign.smtpProfile?.fromName || 'N/A'} &lt;{campaign.smtpProfile?.fromAddress || 'N/A'}&gt;
            </p>
          </div>
          
          <div>
            <p className="text-xs text-zinc-500 mb-1">Sujet</p>
            <p className="text-sm text-gray-900 dark:text-white font-medium">
              {emailSubject || 'Cliquez sur apperçu'}
            </p>
          </div>

          {showEmailPreview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-white/10"
            >
              <p className="text-xs text-zinc-500 mb-2">Aperçu HTML</p>
              {isLoadingEmail ? (
                <div className="rounded-lg bg-gray-100 dark:bg-slate-900/50 p-4 text-center">
                  <p className="text-sm text-zinc-400">Chargement...</p>
                </div>
              ) : emailTemplateHtml ? (
                <div className="rounded-lg bg-white p-4 max-h-96 overflow-y-auto">
                  <iframe
                    srcDoc={emailTemplateHtml}
                    className="w-full h-[400px] border-0"
                    title="Email Preview"
                    sandbox="allow-same-origin"
                  />
                </div>
              ) : (
                <div className="rounded-lg bg-gray-100 dark:bg-slate-900/50 p-4 text-center">
                  <p className="text-sm text-zinc-400">Aucun contenu disponible</p>
                </div>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Landing Page Template */}
      <Card className="rounded-md border border-white/10 bg-white  dark:bg-[#0c1023]/90  ">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-sm bg-purple-500/20 p-3">
                <Globe className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-gray-900 dark:text-white">Landing Page</CardTitle>
                <CardDescription className="text-sm text-zinc-400">
                  {campaign.landingPageTemplate?.name || 'N/A'}
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={() => setShowLandingPreview(!showLandingPreview)}
              size="sm"
              variant="outline"
              className="border-purple-500/30 bg-purple-500/10 text-gray-900 dark:text-white hover:text-gray-900 dark:text-white hover:bg-purple-500/20"
            >
              <Eye className="w-4 h-4 mr-2" />
              {showLandingPreview ? 'Masquer' : 'Aperçu'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {campaign.landingPageUrl && (
            <div>
              <p className="text-xs text-zinc-500 mb-1">URL</p>
              <a 
                href={campaign.landingPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
              >
                {campaign.landingPageUrl}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
          
          {campaign.landingPageTemplate && (
            <div>
              <p className="text-xs text-zinc-500 mb-1">Titre</p>
              <p className="text-sm text-gray-900 dark:text-white font-medium">
                {(campaign.landingPageTemplate as any).title || 'N/A'}
              </p>
            </div>
          )}

          {showLandingPreview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-white/10"
            >
              <p className="text-xs text-zinc-500 mb-2">Aperçu HTML</p>
              {isLoadingLanding ? (
                <div className="rounded-lg bg-gray-100 dark:bg-slate-900/50 p-4 text-center">
                  <p className="text-sm text-zinc-400">Chargement...</p>
                </div>
              ) : landingTemplateHtml ? (
                <div className="rounded-lg bg-white p-4 max-h-96 overflow-y-auto">
                  <iframe
                    srcDoc={landingTemplateHtml}
                    className="w-full h-[400px] border-0"
                    title="Landing Page Preview"
                    sandbox="allow-same-origin"
                  />
                </div>
              ) : (
                <div className="rounded-lg bg-gray-100 dark:bg-slate-900/50 p-4 text-center">
                  <p className="text-sm text-zinc-400">Aucun contenu disponible</p>
                </div>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
