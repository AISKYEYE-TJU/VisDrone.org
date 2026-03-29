import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, ChevronRight, Eye, EyeOff,
  Lightbulb, Brain, Search, FileText, Zap,
  CheckCircle, AlertCircle, Clock, ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export interface ReasoningStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  timestamp?: Date;
  input?: string;
  output?: string;
  reasoning?: string;
  duration?: number;
  metadata?: Record<string, any>;
}

export interface ReasoningTrace {
  agentName: string;
  goal: string;
  steps: ReasoningStep[];
  finalResult?: string;
  confidence?: number;
}

interface ExplainableProcessProps {
  trace: ReasoningTrace;
  defaultExpanded?: boolean;
  showTimestamps?: boolean;
}

const StepStatusIcon: React.FC<{ status: ReasoningStep['status'] }> = ({ status }) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'running':
      return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
    case 'error':
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    default:
      return <Clock className="w-4 h-4 text-gray-400" />;
  }
};

const StepCard: React.FC<{ step: ReasoningStep; showTimestamps: boolean }> = ({ step, showTimestamps }) => {
  const [expanded, setExpanded] = useState(false);

  const hasDetails = step.input || step.output || step.reasoning || step.metadata;

  return (
    <div className="border rounded-lg overflow-hidden">
      <div
        className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-50 ${
          step.status === 'running' ? 'bg-blue-50' : ''
        }`}
        onClick={() => hasDetails && setExpanded(!expanded)}
      >
        <StepStatusIcon status={step.status} />
        <div className="flex-1">
          <div className="font-medium text-sm">{step.title}</div>
          <div className="text-xs text-muted-foreground">{step.description}</div>
        </div>
        <div className="flex items-center gap-2">
          {step.duration && (
            <Badge variant="outline" className="text-xs">
              {step.duration}ms
            </Badge>
          )}
          {showTimestamps && step.timestamp && (
            <span className="text-xs text-muted-foreground">
              {step.timestamp.toLocaleTimeString()}
            </span>
          )}
          {hasDetails && (
            <motion.div animate={{ rotate: expanded ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {expanded && hasDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="border-t bg-slate-50 p-4 space-y-3">
              {step.input && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" />
                    输入
                  </div>
                  <div className="bg-white p-2 rounded border text-xs font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                    {step.input}
                  </div>
                </div>
              )}

              {step.reasoning && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <Brain className="w-3 h-3" />
                    推理过程
                  </div>
                  <div className="bg-purple-50 p-2 rounded border border-purple-200 text-xs whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {step.reasoning}
                  </div>
                </div>
              )}

              {step.output && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    输出
                  </div>
                  <div className="bg-green-50 p-2 rounded border border-green-200 text-xs font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {step.output}
                  </div>
                </div>
              )}

              {step.metadata && Object.keys(step.metadata).length > 0 && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1">元数据</div>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(step.metadata).map(([key, value]) => (
                      <Badge key={key} variant="secondary" className="text-xs">
                        {key}: {String(value)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ExplainableProcess: React.FC<ExplainableProcessProps> = ({
  trace,
  defaultExpanded = false,
  showTimestamps = true
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [showAllDetails, setShowAllDetails] = useState(false);

  const completedSteps = trace.steps.filter(s => s.status === 'completed').length;
  const totalSteps = trace.steps.length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="w-5 h-5" />
            可解释性分析
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {completedSteps}/{totalSteps} 步骤完成
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {expanded ? '收起' : '展开'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <CardContent className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="font-medium text-sm">目标</span>
                </div>
                <p className="text-sm text-muted-foreground">{trace.goal}</p>
              </div>

              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowAllDetails(!showAllDetails)}
                >
                  {showAllDetails ? '隐藏所有详情' : '显示所有详情'}
                </Button>
              </div>

              <div className="space-y-2">
                {trace.steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <StepCard step={step} showTimestamps={showTimestamps} />
                  </motion.div>
                ))}
              </div>

              {trace.finalResult && (
                <>
                  <Separator />
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="font-medium text-sm">最终结果</span>
                      {trace.confidence && (
                        <Badge variant="outline" className="text-xs">
                          置信度: {(trace.confidence * 100).toFixed(0)}%
                        </Badge>
                      )}
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-sm">
                      {trace.finalResult}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default ExplainableProcess;
