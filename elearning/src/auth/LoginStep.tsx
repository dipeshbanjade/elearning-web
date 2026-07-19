import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginApi from "../api/login";
import { getStoredUser, setStoredUser } from "../helper/helper";

const SUBCATEGORY_ICONS: Record<string, string> = {
  Mathematics: "📐",
  Science: "🔬",
  English: "📖",
  History: "🏛️",
  "Computer Science": "💻",
  Art: "🎨",
  Music: "🎵",
  Geography: "🌍",
};

type SubCategory = { _id: string; name: string; categoryId: string };

export default function LoginStep() {
  const [user] = useState(() => getStoredUser());
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.token) {
      setLoading(false);
      return;
    }
    LoginApi.fetchSubCategories(user.token)
      .then((res) => {
        if (res?.subCategories) setSubcategories(res.subCategories);
      })
      .finally(() => setLoading(false));
  }, [user?.token]);

  const handleNext = async () => {
    if (!selectedSubcategoryId || !user?.token) return;
    setLoading(true);
    const saveSubcategories = await LoginApi.saveUserSubcategories(
      user.token,
      selectedSubcategoryId,
    );

    if (saveSubcategories?.success) {
      setStoredUser({
        ...user,
        loginStep: 2,
        subCategoryId: selectedSubcategoryId,
      });
      navigate("/dashboard");
      setLoading(false);
    }
  };

  const selectedSubcategory = subcategories.find(
    (s) => s._id === selectedSubcategoryId,
  );

  if (!user)
    return (
      <div className="step-page">
        <div
          className="step-body"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p style={{ color: "#64748B" }}>Please log in first.</p>
        </div>
      </div>
    );

  if (user.loginStep !== 1) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="step-page">
      {/* Top nav */}
      <header className="step-nav">
        <span className="step-nav-logo">eLearning</span>
        <div className="step-nav-progress">
          <span className="progress-dot active" />
          <span className="progress-dot" />
          <span className="progress-label">Step 1 of 2</span>
        </div>
      </header>

      {/* Body */}
      <main className="step-body">
        <div className="step-title">
          <span className="step-badge">Getting started</span>
          <h1>Choose your categories</h1>
          <p>
            Pick the categories you'd like to focus on — you can change this
            later.
          </p>
        </div>

        <div className="subject-grid">
          {subcategories.map((sub) => (
            <div
              key={sub._id}
              className={`subject-card ${selectedSubcategoryId === sub._id ? "selected" : ""}`}
              onClick={() => setSelectedSubcategoryId(sub._id)}
            >
              <span className="subject-check">✓</span>
              <div className="subject-icon">
                {SUBCATEGORY_ICONS[sub.name] ?? "📚"}
              </div>
              <div className="subject-name">{sub.name}</div>
            </div>
          ))}

          {loading && (
            <p
              style={{
                gridColumn: "1/-1",
                color: "#94A3B8",
                fontSize: ".9rem",
              }}
            >
              Loading subcategories…
            </p>
          )}

          {!loading && subcategories.length === 0 && (
            <p
              style={{
                gridColumn: "1/-1",
                color: "#94A3B8",
                fontSize: ".9rem",
              }}
            >
              No subcategories found. Please contact support.
            </p>
          )}
        </div>
      </main>

      {/* Sticky footer */}
      <footer className="step-footer">
        <span className="step-footer-info">
          {selectedSubcategory ? (
            <>
              Selected: <strong>{selectedSubcategory.name}</strong>
            </>
          ) : (
            "Select a subject to continue"
          )}
        </span>
        <button
          className="step-next-btn"
          onClick={handleNext}
          disabled={!selectedSubcategoryId}
        >
          Next <span className="btn-arrow">→</span>
        </button>
      </footer>
    </div>
  );
}
