import React from 'react';
import { CheckCircle2, Clock, Send } from 'lucide-react';
import { Badge } from '@sebenarnya/design-system';
import { FactCheckRequestStatus } from '../types/social';

const ICONS = { Completed: CheckCircle2, 'Under Review': Clock, Submitted: Send } as const;

/**
 * Fact-check request status. The design system has no status colours, so Completed is the
 * filled badge, open requests are outlined, and each carries an icon.
 */
export const RequestStatusBadge: React.FC<{ status: FactCheckRequestStatus; label?: string; size?: 'sm' | 'md' }> = ({
  status,
  label,
  size = 'sm',
}) => (
  <Badge size={size} variant={status === 'Completed' ? 'muted' : 'outline'} icon={ICONS[status]} className="shrink-0">
    {label ?? status}
  </Badge>
);
