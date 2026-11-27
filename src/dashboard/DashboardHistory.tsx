import React, { useState } from 'react';
import { Trash2, FileQuestion, Eye, ShieldCheck } from 'lucide-react';
import { Alert, Badge, Button, Card, Dialog, EmptyState, IconButton, SearchField, Select } from '@sebenarnya/design-system';
import { useAifa } from '../context/AifaContext';
import { VerificationHistoryRecord, OverallAssessment } from '../types/aifa';
import { AssessmentLabel } from '../extension/shared/AssessmentLabel';

interface DashboardHistoryProps {
  /** Verdict filter to start with (set when arriving from an Overview card). */
  initialAssessmentFilter?: string;
}

const ASSESSMENT_WORDS: Record<OverallAssessment, string> = {
  supported: 'Supported',
  false: 'False',
  misleading: 'Misleading',
  mixed: 'Unverified',
  unverified: 'Unverified',
};

export const DashboardHistory: React.FC<DashboardHistoryProps> = ({ initialAssessmentFilter = 'all' }) => {
  const { verificationHistory, deleteHistoryRecord, clearHistory } = useAifa();

  const [searchQuery, setSearchQuery] = useState('');
  const [assessmentFilter, setAssessmentFilter] = useState<string>(initialAssessmentFilter);
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<VerificationHistoryRecord | null>(null);

  // Filtered records
  const filteredRecords = verificationHistory.filter((record) => {
    const matchesSearch =
      record.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.platformName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.summary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAssessment =
      assessmentFilter === 'all' ||
      (assessmentFilter === 'false-or-misleading'
        ? record.overallAssessment === 'false' || record.overallAssessment === 'misleading'
        : record.overallAssessment === assessmentFilter);

    const matchesContentType = contentTypeFilter === 'all' || record.contentType === contentTypeFilter;

    return matchesSearch && matchesAssessment && matchesContentType;
  });

  return (
    <div className="flex flex-col gap-block">
      {/* Title & Controls Bar */}
      <div className="flex flex-row md:flex-col items-end md:items-start justify-between gap-group pt-8">
        <div className="flex flex-col gap-text">
          <h1 className="text-heading-lg text-foreground">Verification History Archive</h1>
          <p className="text-body text-muted-foreground">
            Search, filter, and inspect verified news stories and social media posts.
          </p>
        </div>

        {verificationHistory.length > 0 && (
          <Button variant="outline" icon={Trash2} onClick={clearHistory}>
            Clear History
          </Button>
        )}
      </div>

      {/* Filter and Search Bar (filters as you type: no submit button) */}
      <Card variant="raised" size="sm" className="flex-row md:flex-col items-center md:items-stretch gap-inline">
        <SearchField
          size="sm"
          label="Search verifications"
          hideLabel
          buttonLabel={null}
          placeholder="Search by headline, topic, or source..."
          value={searchQuery}
          onChange={setSearchQuery}
          // Results already follow the text; this only stops Enter from submitting (reloading) the page.
          onSubmit={() => {}}
          className="flex-1"
        />
        <div className="flex items-center gap-inline">
          <Select
            size="sm"
            pill
            aria-label="Verdict"
            value={assessmentFilter}
            onChange={(e) => setAssessmentFilter(e.target.value)}
          >
            <option value="all">All Verdicts</option>
            <option value="supported">Supported</option>
            <option value="false">False</option>
            <option value="misleading">Misleading</option>
            <option value="false-or-misleading">False or Misleading</option>
            <option value="unverified">Unverified</option>
          </Select>
          <Select
            size="sm"
            pill
            aria-label="Content type"
            value={contentTypeFilter}
            onChange={(e) => setContentTypeFilter(e.target.value)}
          >
            <option value="all">All Content Types</option>
            <option value="article">News Articles</option>
            <option value="social-post">Social Posts</option>
          </Select>
        </div>
      </Card>

      {/* History Items List */}
      <div className="flex flex-col gap-cards">
        {filteredRecords.length === 0 ? (
          <Card variant="raised">
            <EmptyState
              icon={FileQuestion}
              title="No verifications found"
              description="No verification records match your active search or filters. Try adjusting your query or verify articles from the news portal."
            />
          </Card>
        ) : (
          filteredRecords.map((record) => (
            <Card key={record.id} variant="raised" className="gap-12">
              <div className="flex flex-row sm:flex-col items-center sm:items-start justify-between gap-inline">
                <div className="flex items-center gap-inline flex-wrap">
                  <AssessmentLabel assessment={record.overallAssessment} label={ASSESSMENT_WORDS[record.overallAssessment]} />
                  <span className="text-caption text-muted-foreground">{record.verifiedAt}</span>
                  <Badge size="sm" className="self-center">{record.platformName}</Badge>
                  <Badge size="sm" className="self-center uppercase">
                    {record.contentType}
                  </Badge>
                </div>

                <div className="flex items-center gap-6 sm:self-end">
                  <Button size="sm" icon={Eye} onClick={() => setSelectedRecord(record)}>
                    View Claims
                  </Button>
                  <IconButton
                    icon={Trash2}
                    label="Delete record"
                    title="Delete record"
                    size="icon-sm"
                    onClick={() => deleteHistoryRecord(record.id)}
                  />
                </div>
              </div>

              <h3 className="text-title text-foreground">{record.headline}</h3>

              <p className="text-body-sm text-text-secondary bg-muted p-16 rounded-media">{record.summary}</p>

              <div className="flex items-center justify-between gap-inline text-caption text-muted-foreground">
                <span>{record.claimsCount} claims evaluated and cross-referenced</span>
                <span>ID: {record.id}</span>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Record Claims Detail */}
      <Dialog
        open={!!selectedRecord}
        onOpenChange={(open) => !open && setSelectedRecord(null)}
        // The original modal did not close on a backdrop click.
        dismissible={false}
        size="lg"
        className="font-sans"
        title={selectedRecord?.headline ?? ''}
        description="Verification Findings Detail"
        footer={<Button onClick={() => setSelectedRecord(null)}>Close</Button>}
      >
        {selectedRecord && (
          <div className="flex flex-col gap-group text-body-sm text-text-secondary">
            <div className="flex items-center gap-inline">
              <span className="text-label-sm text-muted-foreground">Overall Rating:</span>
              <AssessmentLabel
                assessment={selectedRecord.overallAssessment}
                label={ASSESSMENT_WORDS[selectedRecord.overallAssessment]}
              />
            </div>

            <Card size="sm" className="gap-4">
              <h3 className="text-label-sm text-foreground">Assessment Summary</h3>
              <p>{selectedRecord.result?.assessmentExplanation || selectedRecord.summary}</p>
            </Card>

            <div className="flex flex-col gap-12">
              <h3 className="text-label text-foreground">
                Evaluated Claims ({selectedRecord.result?.claims?.length || 0})
              </h3>

              {selectedRecord.result?.claims?.map((claim) => (
                <Card key={claim.id} size="sm" className="gap-text">
                  <div className="flex items-center justify-between gap-inline">
                    <span className="text-label-sm text-foreground">Claim #{claim.claimNumber}</span>
                    <AssessmentLabel assessment={claim.verdict} label={claim.verdictLabel} />
                  </div>
                  <p className="text-body-sm font-medium text-foreground">"{claim.statement}"</p>
                  <p className="text-body-sm text-text-secondary bg-card p-12 rounded-media">{claim.explanation}</p>
                  <Alert icon={ShieldCheck} title="Sebenarnya.my Evidence">
                    {claim.evidence}
                  </Alert>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};
