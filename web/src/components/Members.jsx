import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Download } from 'lucide-react'
import './Members.css'

function PDFViewerAndDownloader({ pdfId, pdfUrl, documentName = "Document" }) {
  const backendUrl = pdfId ? getApiUrl(`/api/members/pdf/${pdfId}`) : pdfUrl;

  const handleDownload = async () => {
    if (!backendUrl) return;

    try {
      let targetUrl = backendUrl;
      if (pdfUrl?.includes('cloudinary.com') && !pdfUrl.includes('fl_attachment')) {
        targetUrl = pdfUrl.replace('/upload/', '/upload/fl_attachment/');
      }

      const response = await fetch(targetUrl);
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
      console.warn("Blob download blocked by CORS policy, falling back to open-tab method.");
      window.open(backendUrl, '_blank');
    }
  };

  return (
    <div className="pdf-viewer-container">
      {backendUrl ? (
        <div className="pdf-viewer-frame">
          <iframe 
            src={backendUrl} 
            title="PDF Document Viewer" 
            className="pdf-iframe"
          />
        </div>
      ) : (
        <div className="pdf-placeholder">
          No document URL found for this profile.
        </div>
      )}

      <div className="pdf-download-section">
        <button 
          onClick={handleDownload}
          disabled={!backendUrl}
          className={`download-button ${!backendUrl ? 'disabled' : ''}`}
        >
          <Download className="download-icon" />
          Download PDF
        </button>
      </div>
    </div>
  );
}

function getApiUrl(path) {
  const configuredBase = (import.meta.env.VITE_API_BASE_URL || '').trim()
  if (configuredBase) {
    return `${configuredBase.replace(/\/$/, '')}${path}`
  }
  return path
}

export default function Members() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedMemberId, setExpandedMemberId] = useState(null)

  useEffect(() => {
    fetchMembers()

    // connect to SSE stream for realtime updates
    const streamUrl = getApiUrl('/api/members/stream')
    let es
    if (typeof window !== 'undefined' && (window).EventSource) {
      try {
        es = new EventSource(streamUrl)

        es.addEventListener('members.initial', (e) => {
          try {
            const data = JSON.parse(e.data)
            setMembers((prev) => (prev.length ? prev : data))
            setLoading(false)
          } catch (err) {}
        })

        es.addEventListener('member.created', (e) => {
          try {
            const member = JSON.parse(e.data)
            setMembers((prev) => [member, ...prev.filter((m) => m.id !== member.id)])
          } catch (err) {}
        })

        es.addEventListener('member.updated', (e) => {
          try {
            const member = JSON.parse(e.data)
            setMembers((prev) => prev.map((m) => (m.id === member.id ? member : m)))
          } catch (err) {}
        })

        es.addEventListener('member.deleted', (e) => {
          try {
            const payload = JSON.parse(e.data)
            setMembers((prev) => prev.filter((m) => m.id !== payload.id))
          } catch (err) {}
        })
      } catch (err) {
        // ignore stream failure
      }
    }

    return () => {
      try {
        es?.close()
      } catch {}
    }
  }, [])

  async function fetchMembers() {
    try {
      const response = await fetch(getApiUrl('/api/members'))
      const data = await response.json()
      if (data.success) {
        setMembers(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch members:', error)
    } finally {
      setLoading(false)
    }
  }

  function toggleExpand(memberId) {
    setExpandedMemberId(expandedMemberId === memberId ? null : memberId)
  }

  if (loading) {
    return (
      <section className="members-section">
        <div className="container">
          <h2 className="section-title">Our Team</h2>
          <p className="loading-text">Loading members...</p>
        </div>
      </section>
    )
  }

  if (members.length === 0) {
    return (
      <section className="members-section">
        <div className="container">
          <h2 className="section-title">Our Team</h2>
          <p className="empty-text">No members to display</p>
        </div>
      </section>
    )
  }

  return (
    <section className="members-section">
      <div className="container">
        <h2 className="section-title">Our Team</h2>
        <div className="members-list">
          {members.map((member) => (
            <div key={member.id} className="member-card">
              <div
                className="member-header"
                onClick={() => toggleExpand(member.id)}
              >
                <div className="member-info">
                  {member.photoUrl && (
                    <img
                      src={member.photoUrl}
                      alt={member.fullName}
                      className="member-photo"
                    />
                  )}
                  <div className="member-details">
                    <h3 className="member-name">{member.fullName}</h3>
                  </div>
                </div>
                <button className="expand-button">
                  {expandedMemberId === member.id ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
              </div>

              {expandedMemberId === member.id && (
                <div className="member-expanded">
                  <div className="member-meta">
                    <p><strong>Job Position:</strong> {member.jobPosition}</p>
                    <p><strong>Status:</strong> {member.status}</p>
                    <p><strong>Age:</strong> {member.age}</p>
                    <p><strong>Passport Number:</strong> {member.passportNumber}</p>
                  </div>

                  {member.pdfFiles && member.pdfFiles.length > 0 ? (
                    <div className="acceptance-letter-section">
                      <h4 className="acceptance-letter-title">Acceptance Letter</h4>
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
                    <p className="no-pdfs-text">No acceptance letter available</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
