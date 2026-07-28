import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginApi from "../../api/login";
import { getStoredUser } from "../../helper/helper";

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

export default function SelectCategories() {
  const navigate = useNavigate();
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
  const [saving, setSaving] = useState(false);

  const user = getStoredUser();

  const firstName = user?.fullname?.split(" ")[0] ?? "there";

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
  }, []);

  const saveCategory = async () => {
    if (!selectedSubcategoryId || !user?.token) return;

    setSaving(true);
    try {
      const res = await LoginApi.saveUserSubcategories(
        user.token,
        selectedSubcategoryId,
      );
      if (res?.success) {
        navigate("/dashboard");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="subject-section">
      <h1 className="section-greeting">Welcome back, {firstName} 👋</h1>
      <p className="section-sub">Choose a subject to start learning</p>

      <div className="subject-btn-grid">
        {loading && <p className="subject-empty">Loading subjects…</p>}

        {!loading && subcategories.length === 0 && (
          <p className="subject-empty">No subjects found for your category.</p>
        )}

        {subcategories.map((sub) => (
          <button
            key={sub._id}
            className={`subject-btn ${selectedSubcategoryId === sub._id ? "selected" : ""}`}
            onClick={() => setSelectedSubcategoryId(sub._id)}
            disabled={saving}
          >
            <span className="btn-icon">
              {SUBCATEGORY_ICONS[sub.name] ?? "📚"}
            </span>
            {sub.name}
          </button>
        ))}
      </div>

      {!loading && subcategories.length > 0 && (
        <button
          className={`subject-continue-btn ${saving ? "saving" : ""}`}
          onClick={saveCategory}
          disabled={!selectedSubcategoryId || saving}
        >
          {saving && <span className="spinner" />}
          {saving ? "Saving…" : "Continue"}
        </button>
      )}
    </div>
  );
}
