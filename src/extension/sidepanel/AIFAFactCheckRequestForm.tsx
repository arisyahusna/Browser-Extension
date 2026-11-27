import React, { useState } from 'react';
import { ArrowLeft, Send, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, Badge, Button, Card, Checkbox, Field, Icon, IconButton, Input, Textarea } from '@sebenarnya/design-system';
import { useAifa } from '../../context/AifaContext';

export const AIFAFactCheckRequestForm: React.FC = () => {
  const {
    activeFactCheckClaim,
    verificationResult,
    returnToResults,
    submitFactCheckRequest,
    isSubmittingRequest,
  } = useAifa();

  const [userNotes, setUserNotes] = useState(
    'This message is circulating widely on WhatsApp and social media groups. Please verify if any official government circular exists.'
  );
  const [includeSupporting, setIncludeSupporting] = useState(true);

  if (!activeFactCheckClaim || !verificationResult) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFactCheckRequest(userNotes, includeSupporting);
  };

  return (
    <div className="px-4 py-8 flex flex-col gap-block">
      {/* Header with back button */}
      <div className="flex items-center gap-12">
        <IconButton
          icon={ArrowLeft}
          size="icon-sm"
          onClick={returnToResults}
          title="Back to verification results"
          label="Back to verification results"
        />
        <div>
          <h3 className="text-title text-foreground">Request Fact-Check</h3>
          <p className="text-caption text-muted-foreground">Submit unverified claim to Sebenarnya.my</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-group">
        {/* Claim to verify (prefilled) */}
        <div className="flex flex-col gap-stack">
          <p className="text-label-sm text-foreground">Claim to Verify</p>
          <Card variant="raised" size="sm" className="flex flex-col gap-text">
            <Badge size="sm">
              Claim #{activeFactCheckClaim.claimNumber} • {activeFactCheckClaim.verdictLabel}
            </Badge>
            <p className="text-body-sm font-medium text-foreground">"{activeFactCheckClaim.statement}"</p>
          </Card>
        </div>

        {/* Source URL & Platform (prefilled) */}
        <div className="grid grid-cols-2 gap-12">
          <Field label="Source Platform">
            <Input
              type="text"
              readOnly
              value={verificationResult.platformName || verificationResult.sourceWebsite}
              className="select-none"
            />
          </Field>

          <Field label="Source URL">
            <Input type="text" readOnly value={verificationResult.sourceWebsite} className="truncate select-all" />
          </Field>
        </div>

        {/* Additional Information */}
        <Field label="Additional Information (Optional)" hint="Context for editorial team">
          <Textarea
            rows={3}
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            placeholder="Explain why you want this claim verified or where you encountered it..."
          />
        </Field>

        {/* Include Supporting Content */}
        <Card variant="raised" size="sm">
          <Checkbox
            label="Include Supporting Content"
            hint="Automatically attaches the post caption or article text and initial AIFA discrepancy flags."
            checked={includeSupporting}
            onCheckedChange={setIncludeSupporting}
          />
        </Card>

        {/* Disclaimer Notice */}
        <Alert icon={AlertCircle}>
          Demonstration mode: submissions are recorded in local demo state. No live transmission occurs.
        </Alert>

        {/* Submit Button: stacked, since a button label never wraps and both don't fit on one row */}
        <div className="flex flex-col gap-8">
          <Button
            type="submit"
            disabled={isSubmittingRequest}
            aria-busy={isSubmittingRequest || undefined}
            icon={isSubmittingRequest ? <Icon icon={Loader2} className="animate-spin" /> : Send}
            className="w-full"
          >
            {isSubmittingRequest ? 'Submitting to Sebenarnya.my...' : 'Submit Request to Sebenarnya.my'}
          </Button>

          <Button variant="outline" onClick={returnToResults} className="w-full">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
