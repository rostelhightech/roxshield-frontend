// email-editor-wrapper.tsx
import { useRef, useState, forwardRef, useImperativeHandle, useEffect, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { oneDark } from '@codemirror/theme-one-dark';
import { templatesList } from '@/constants/templatesList';
import { Maximize2, Minimize2, Sparkles, Copy, Check, Code2, Eye, Columns2, Mail, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

const GOPHISH_VARS = [
  '{{.FirstName}}', '{{.LastName}}', '{{.Email}}',
  '{{.Position}}',
];

const MODES = [
  { id: 'split',   icon: Columns2, label: 'Split'   },
  { id: 'code',    icon: Code2,    label: 'HTML'    },
  { id: 'preview', icon: Eye,      label: 'Preview' },
  { id: 'text',    icon: Mail,     label: 'Text'    },
] as const;

type Mode = typeof MODES[number]['id'];

export interface EmailEditorHandle {
  exportHtml: () => Promise<{ html: string; text?: string }>;
}

interface Props {
  defaultHtml?: string;
  defaultText?: string;
  showVariables?: boolean;
}

export const EmailEditorWrapper = forwardRef<EmailEditorHandle | null, Props>(
  ({ defaultHtml, defaultText, showVariables = true }, ref) => {
    const { t: tCommon } = useTranslation('common');
    const [code, setCode] = useState(defaultHtml ?? templatesList.microsoft365);
    const [text, setText] = useState(defaultText ?? '');
    const [mode, setMode] = useState<Mode>('split');
    const [fullscreen, setFullscreen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [aiOpen, setAiOpen] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
      if (iframeRef.current) iframeRef.current.srcdoc = code;
    }, [code, mode]);

    useEffect(() => {
      if (defaultHtml !== undefined) {
        setCode(defaultHtml);
      }
    }, [defaultHtml]);

    useEffect(() => {
      if (defaultText !== undefined) {
        setText(defaultText);
      }
    }, [defaultText]);

    useImperativeHandle(ref, () => ({
      exportHtml: () => Promise.resolve({ html: code, text }),
    }));

    const insertVar = useCallback((v: string) => {
      setCode(c => c + v);
    }, []);

    const handleCopy = useCallback(async () => {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }, [code]);

    const handleAiGenerate = useCallback(async () => {
      if (!aiPrompt.trim()) return;
      setAiLoading(true);
      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json', // Correction : syntaxe correcte pour les headers
            'x-api-key': process.env.ANTHROPIC_API_KEY || '' // Ajout de la clé API
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4096,
            messages: [{
              role: 'user',
              content: `Tu es un expert en création de templates d'emails de phishing pour des campagnes de sensibilisation à la sécurité informatique en entreprise.

Génère un template HTML d'email de phishing réaliste basé sur cette description : "${aiPrompt}"

Règles :
- HTML complet avec styles inline
- Utilise les variables Gophish : {{.FirstName}}, {{.LastName}}, {{.Email}}, {{.Position}}, {{.URL}}, {{.From}}
- Rendu réaliste imitant une vraie entreprise/service
- Réponds UNIQUEMENT avec le code HTML, rien d'autre`,
            }],
          }),
        });
        const data = await res.json();
        const generated = data.content?.[0]?.text ?? '';
        if (generated) setCode(generated);
        setAiOpen(false);
        setAiPrompt('');
      } catch (e) {
        console.error(e);
      } finally {
        setAiLoading(false);
      }
    }, [aiPrompt]);

    return (
      <div className={cn(
        'flex flex-col border rounded-sm overflow-hidden bg-white dark:bg-background transition-all',
        fullscreen
          ? 'fixed inset-0 z-50 rounded-none border-0'
          : 'h-full',
      )}>

        {/* ── Toolbar ── */}
        <div className="flex items-center gap-1.5 px-3 h-12 border-b bg-gray-50 dark:bg-muted/30 shrink-0">
          {/* Mode tabs */}
          <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-muted rounded-md p-0.5">
            {MODES.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setMode(id)}
                className={cn(
                  'flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded transition-all',
                  mode === id
                    ? 'bg-white dark:bg-background shadow-sm font-medium text-gray-900 dark:text-foreground'
                    : 'text-gray-500 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground',
                )}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          {/* AI Generate */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 text-xs border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
            onClick={() => setAiOpen(o => !o)}
          >
            <Sparkles size={12} />
            {tCommon('admin.templates.generate')} {/* Correction : utilisation de t() */}
          </Button>

          {/* Copy */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 text-xs border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
            onClick={handleCopy}
          >
            {copied ? <Check size={12} className="text-green-600 dark:text-green-500" /> : <Copy size={12} />}
            {copied ? tCommon('admin.templates.copied') : tCommon('admin.templates.copy')}
          </Button>

          {/* Fullscreen */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-700 dark:text-gray-300"
            onClick={() => setFullscreen(f => !f)}
          >
            {fullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </Button>
        </div>

        {/* ── AI Panel ── */}
        {aiOpen && (
          <div className="flex items-center gap-2 px-3 py-2 border-b bg-violet-50 dark:bg-violet-950/30 shrink-0">
            <Sparkles size={14} className="text-violet-600 dark:text-violet-500 shrink-0" />
            <Input
              type="text"
              placeholder={tCommon('admin.templates.ai_placeholder')} 
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAiGenerate()}
              className="h-7 text-xs flex-1 bg-white dark:bg-background border-gray-300 dark:border-gray-700"
            />
            <Button
              type="button"
              size="sm"
              className="h-7 text-xs bg-violet-600 hover:bg-violet-700 text-white"
              onClick={handleAiGenerate}
              disabled={aiLoading || !aiPrompt.trim()}
            >
              {aiLoading ? tCommon('admin.templates.generating') : tCommon('admin.templates.generate')}
            </Button>
            <button
              type="button"
              onClick={() => setAiOpen(false)}
              className="text-gray-500 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* ── Variables bar ── */}
        {showVariables && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 border-b bg-white dark:bg-background shrink-0 flex-wrap">
            <span className="text-xs text-gray-500 dark:text-muted-foreground mr-1">Variables :</span>
            {GOPHISH_VARS.map(v => (
              <button
                key={v}
                type="button"
                onClick={() => insertVar(v)}
                className="font-mono text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:opacity-75 transition-opacity"
              >
                {v}
              </button>
            ))}
          </div>
        )}

        {/* ── Panels ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* Text mode */}
          {mode === 'text' && (
            <div className="flex-1 flex flex-col p-4 gap-3">
              <p className="text-xs text-gray-500 dark:text-muted-foreground">
                {tCommon('admin.templates.text_mode_desc')}
              </p>
              <Textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder={tCommon('admin.templates.text_mode_placeholder')}
                className="flex-1 font-mono text-sm resize-none bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
              />
            </div>
          )}

          {/* Code panel */}
          {(mode === 'code' || mode === 'split') && (
            <div className={cn('overflow-auto', mode === 'split' ? 'w-1/2' : 'flex-1')}>
              <CodeMirror
                value={code}
                extensions={[html()]}
                theme={oneDark}
                onChange={setCode}
                height="100%"
                style={{ fontSize: '12px' }}
              />
            </div>
          )}

          {mode === 'split' && <div className="w-px bg-gray-200 dark:bg-border shrink-0" />}

          {/* Preview panel */}
          {(mode === 'preview' || mode === 'split') && (
            <iframe
              ref={iframeRef}
              className={cn('border-none bg-white', mode === 'split' ? 'w-1/2' : 'flex-1')}
              title={tCommon('admin.templates.preview')} 
              sandbox="allow-same-origin"
            />
          )}
        </div>

        {/* ── Status bar ── */}
        <div className="flex items-center gap-3 px-3 h-7 border-t bg-gray-50 dark:bg-muted/20 shrink-0">
          <span className="text-[11px] text-gray-500 dark:text-muted-foreground">
            {code.length.toLocaleString()} chars
          </span>
          {showVariables && (
            <span className="text-[11px] text-gray-500 dark:text-muted-foreground">
              {new Set(code.match(/\{\{\.[\w]+\}\}/g) ?? []).size} variables
            </span>
          )}
          <div className="flex-1" />
          <Badge variant="outline" className="text-[10px] h-4 px-1.5 text-green-700 dark:text-green-600 border-green-400 dark:border-green-300">
            Live
          </Badge>
        </div>
      </div>
    );
  },
);

EmailEditorWrapper.displayName = 'EmailEditorWrapper';