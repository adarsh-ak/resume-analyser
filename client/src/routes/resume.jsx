import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ATS from "~/components/feedback/ATS";
import Details from "~/components/feedback/Details";
import Summary from "~/components/feedback/Summary";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
  { title: "Resumind | Review" },
  { name: "description", content: "Detailed overview of your resume" },
];

const Resume = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();

  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}`);
    }
  }, [isLoading, auth.isAuthenticated, navigate, id]);

  useEffect(() => {
    const loadResume = async () => {
      const resume = await kv.get(`resume:${id}`);
      if (!resume) return;

      const data = JSON.parse(resume);

      const resumeBlob = await fs.read(data.resumePath);
      if (!resumeBlob) return;

      const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setResumeUrl(pdfUrl);

      const imageBlob = await fs.read(data.imagePath);
      if (!imageBlob) return;

      const imgUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imgUrl);

      setFeedback(data.feedback);
    };

    loadResume();
  }, [id, fs, kv]);

  return (
    <main className="pt-0! min-h-0!">
      {/* Top Navigation - Fixed */}
      <nav className="resume-nav sticky top-0 z-50 bg-white shadow-sm">
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
          <span className="text-gray-800 text-sm font-semibold">
            Back to Homepage
          </span>
        </Link>
      </nav>

      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        {/* Left Section — Resume Preview (Sticky) */}
        <section className="w-1/2 max-lg:w-full px-8 py-6 bg-[url('/images/bg-small.svg')] bg-cover lg:sticky lg:top-[73px] lg:h-[calc(100vh-73px)] flex items-center justify-center overflow-hidden">
          {imageUrl && resumeUrl ? (
            <div className="animate-fadeIn gradient-border h-full w-full max-w-[600px] flex items-center justify-center">
              <a 
                href={resumeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-full w-full flex items-center justify-center"
              >
                <img
                  src={imageUrl}
                  alt="Resume Preview"
                  className="max-h-full max-w-full object-contain rounded-2xl"
                />
              </a>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <img
                src="/images/resume-scan-2.gif"
                alt="Loading"
                className="w-48 h-48"
              />
            </div>
          )}
        </section>

        {/* Right Section — Feedback (Scrollable) */}
        <section className="w-1/2 max-lg:w-full px-8 py-6 min-h-screen">
          <h2 className="text-4xl text-black font-bold mb-8">Resume Review</h2>

          {feedback ? (
            <div className="flex flex-col gap-8 animate-fadeIn pb-12">
              <Summary feedback={feedback} />
              <ATS
                score={feedback.ATS?.score || 0}
                suggestions={feedback.ATS?.tips || []}
              />
              <Details feedback={feedback} />
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <img
                src="/images/resume-scan-2.gif"
                alt="Loading"
                className="w-full max-w-md"
              />
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Resume;