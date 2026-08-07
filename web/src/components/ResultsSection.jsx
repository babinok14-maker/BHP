import { useEffect, useState, useMemo } from 'react';
import { Download } from 'lucide-react';
import './ResultsSection.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=540&q=80';

function PDFViewerAndDownloader({ pdfId, pdfUrl, documentName = "Document" }) {
  const sourceUrl = pdfUrl || (pdfId ? `${API_BASE_URL}/api/members/pdf/${pdfId}` : undefined);

  const handleDownload = async () => {
    if (!sourceUrl) return;

    try {
      const response = await fetch(sourceUrl);
      if (!response.ok) throw new Error('Failed to download PDF');
      const blob = await response.blob();
      const localBlobUrl = URL.createObjectURL(blob);

      const hiddenLink = document.createElement('a');
      hiddenLink.href = localBlobUrl;
      hiddenLink.download = `${documentName.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(hiddenLink);
      hiddenLink.click();
      document.body.removeChild(hiddenLink);
      URL.revokeObjectURL(localBlobUrl);
    } catch (error) {
      window.open(sourceUrl, '_blank');
    }
  };

  const handleOpenPdf = () => {
    if (sourceUrl) {
      window.open(sourceUrl, '_blank');
    }
  };

  return (
    <div className="pdf-viewer-container">
      {pdfId ? (
        <>
          <div className="pdf-info-display">
            <div className="pdf-file-info">
              <p className="pdf-file-name">{documentName}</p>
              <p className="pdf-url">Served via server endpoint</p>
            </div>
          </div>
          <div className="pdf-actions">
            <button 
              onClick={handleOpenPdf}
              className="open-button"
            >
              Open PDF
            </button>
            <button 
              onClick={handleDownload}
              className="download-button"
            >
              <Download className="download-icon" />
              Download PDF
            </button>
          </div>
        </>
      ) : (
        <div className="pdf-placeholder">
          No document available for this profile.
        </div>
      )}
    </div>
  );
}

export default function ResultsSection({ searchTerm = '' }) {
  const [members, setMembers] = useState([]);
  const [expandedMemberId, setExpandedMemberId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const filteredMembers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return members;
    return members.filter((member) => member.fullName?.toLowerCase().includes(query));
  }, [members, searchTerm]);

  useEffect(() => {
    let isMounted = true;

    async function loadMembers() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/members`);

        if (!response.ok) {
          throw new Error('Unable to load members from the server.');
        }

        const payload = await response.json();
        const nextMembers = Array.isArray(payload?.data) ? payload.data : [];

        if (isMounted) {
          console.log('Members loaded:', nextMembers);
          setMembers(nextMembers);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to load members right now.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadMembers();

    // Server-Sent Events: listen for member changes so UI updates instantly
    let es;
    try {
      es = new EventSource(`${API_BASE_URL}/api/members/stream`);

      es.addEventListener('members.initial', (e) => {
        const list = JSON.parse(e.data || '[]');
        if (isMounted) setMembers(list);
      });

      es.addEventListener('member.created', (e) => {
        const m = JSON.parse(e.data || '{}');
        if (isMounted && m.published) setMembers((prev) => [m, ...prev]);
      });

      es.addEventListener('member.updated', (e) => {
        const m = JSON.parse(e.data || '{}');
        if (!isMounted) return;
        setMembers((prev) => {
          const idx = prev.findIndex((x) => x.id === m.id);
          if (m.published) {
            if (idx === -1) return [m, ...prev];
            const copy = [...prev];
            copy[idx] = m;
            return copy;
          } else {
            // became unpublished -> remove from list
            if (idx === -1) return prev;
            return prev.filter((x) => x.id !== m.id);
          }
        });
      });

      es.addEventListener('member.deleted', (e) => {
        const payload = JSON.parse(e.data || '{}');
        if (isMounted && payload?.id) setMembers((prev) => prev.filter((x) => x.id !== payload.id));
      });
    } catch (err) {
      // ignore EventSource errors
    }

    return () => {
      isMounted = false;
      if (es) es.close();
    };
  }, []);

  function toggleDetails(id) {
    setExpandedMemberId(expandedMemberId === id ? null : id);
  }

  return (
    <section className="results-section" id="results">
      <div className="container results-section__content">
        <div className="results-section__header">
          <p className="eyebrow">Selected Candidates</p>
          <h2>Accepted Candidates ⭐⭐⭐⭐</h2>
          <p>
            Congratulations to our selected candidates. We are pleased to welcome you to our team.
          </p>
        </div> 

        {loading ? (
          <div className="results-section__state">Loading members…</div>
        ) : error ? (
          <div className="results-section__state results-section__state--error">{error}</div>
        ) : filteredMembers.length === 0 ? (
          <div className="results-section__state">
            {searchTerm ? 'No members matched your search.' : 'No published members are available yet.'}
          </div>
        ) : (
          <div className="results-section__grid">
            {filteredMembers.map((member) => {
              const expanded = expandedMemberId === member.id;
              return (
                <article key={member.id} className="results-section__card">
                  <div className="results-section__card-header">
                    <div className="results-section__image-wrap">
                      <img
                        className="results-section__image"
                        src={member.photoUrl || PLACEHOLDER_IMAGE}
                        alt={member.fullName}
                      />
                    </div>
                    <button
                      type="button"
                      className="results-section__name"
                      onClick={() => toggleDetails(member.id)}
                    >
                      {member.fullName}
                    </button>
                  </div>
                  {expanded ? (
                    <div className="results-section__details">
                      <div className="results-section__detail-row">
                        <span>passport number</span>
                        <strong>{member.passportNumber || '—'}</strong>
                      </div>
                      <div className="results-section__detail-row">
                        <span>job</span>
                        <strong>{member.jobPosition || '—'}</strong>
                      </div>
                      <div className="results-section__detail-row">
                        <span>age</span>
                        <strong>{member.age ?? '—'}</strong>
                      </div>
                      <div className="results-section__detail-row">
                        <span>status</span>
                        <strong className={member.status === 'Accepted' ? 'results-section__status-badge' : ''}>
                          {member.status || '—'}
                        </strong>
                      </div>
                      {member.pdfFiles && member.pdfFiles.length > 0 ? (
                        <div className="acceptance-letter-section">
                          <h4 className="acceptance-letter-title">Acceptance Letter</h4>
                          {console.log('PDF files for member:', member.fullName, member.pdfFiles)}
                          {member.pdfFiles.map((pdf) => (
                            <PDFViewerAndDownloader
                              key={pdf.id}
                              pdfId={pdf.id}
                              pdfUrl={pdf.fileUrl}
                              documentName={pdf.fileName}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="acceptance-letter-section">
                          <h4 className="acceptance-letter-title">Acceptance Letter</h4>
                          <p className="pdf-placeholder">No PDF files uploaded for this member.</p>
                        </div>
                      )}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
