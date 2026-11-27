import React from 'react';
import { AlertTriangle, HelpCircle } from 'lucide-react';
import { Badge, Verdict, type VerdictType } from '@sebenarnya/design-system';
import { ClaimVerdict, OverallAssessment } from '../../types/aifa';

// The design system has three verdicts. Only these two map onto AIFA's assessments.
const VERDICTS: Partial<Record<OverallAssessment | ClaimVerdict, VerdictType>> = {
  supported: 'benar',
  false: 'palsu',
};

interface AssessmentLabelProps {
  assessment: OverallAssessment | ClaimVerdict;
  label: string;
}

/**
 * Supported / False use the design system Verdict (dot + word).
 * Misleading, mixed and unverified have no design-system verdict, so they use a neutral Badge.
 */
export const AssessmentLabel: React.FC<AssessmentLabelProps> = ({ assessment, label }) => {
  const type = VERDICTS[assessment];
  // Verdict and Badge align to flex-start (for columns); every use here sits in a row, so centre them.
  if (type) return <Verdict type={type} label={label} className="self-center" />;
  return (
    <Badge variant="outline" icon={assessment === 'unverified' ? HelpCircle : AlertTriangle} className="self-center">
      {label}
    </Badge>
  );
};
