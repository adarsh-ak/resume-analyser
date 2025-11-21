import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePuterStore } from "~/lib/puter";

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/auth?next=/");
    }
  }, [auth.isAuthenticated, navigate]);

  // Load resumes
  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumeItems = await kv.list("resumes:*", true);

      const parsedResumes = resumeItems?.map((item) =>
        JSON.parse(item.value)
      );

      console.log("parsedResumes", parsedResumes);

      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    };

    loadResumes();
  }, []);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track Your Applications & Resume Ratings</h1>

          {!loadingResumes && resumes.length === 0 ? (
            <h2>No resumes found. Upload your first resume to get feedback.</h2>
          ) : (
            <h2>Review your submissions and check AI-powered feedback.</h2>
          )}
        </div>

        {/* Loading GIF */}
        {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" />
          </div>
        )}

        {/* Resume List */}
        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {/* No Resumes */}
        {!loadingResumes && resumes.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link
              to="/upload"
              className="primary-button w-fit text-xl font-semibold"
            >
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
