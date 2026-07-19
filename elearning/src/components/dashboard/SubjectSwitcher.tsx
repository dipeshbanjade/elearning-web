import Select, { type StylesConfig } from "react-select";
import type { Subject } from "../../data/mockDashboard";

interface Option {
  value: string;
  label: string;
  icon: string;
}

interface Props {
  subjects: Subject[];
  selectedSubjectId: string;
  onChange: (subjectId: string) => void;
}

const selectStyles: StylesConfig<Option, false> = {
  control: (base, state) => ({
    ...base,
    minWidth: 240,
    borderRadius: 12,
    borderColor: state.isFocused ? "#4F46E5" : "#E2E8F0",
    boxShadow: state.isFocused ? "0 0 0 3px #EEF2FF" : "none",
    padding: "2px 4px",
    "&:hover": { borderColor: "#4F46E5" },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#4F46E5"
      : state.isFocused
        ? "#EEF2FF"
        : "#fff",
    color: state.isSelected ? "#fff" : "#1E293B",
    fontWeight: state.isSelected ? 700 : 500,
    cursor: "pointer",
  }),
  singleValue: (base) => ({ ...base, fontWeight: 700, color: "#1E293B" }),
  menu: (base) => ({ ...base, borderRadius: 12, overflow: "hidden", zIndex: 50 }),
};

export default function SubjectSwitcher({ subjects, selectedSubjectId, onChange }: Props) {
  const options: Option[] = subjects.map((s) => ({
    value: s.id,
    label: s.name,
    icon: s.icon,
  }));

  const currentOption = options.find((o) => o.value === selectedSubjectId) ?? null;

  return (
    <div className="subject-switcher">
      <Select<Option, false>
        classNamePrefix="subject-select"
        styles={selectStyles}
        options={options}
        value={currentOption}
        isSearchable={false}
        onChange={(opt) => opt && onChange(opt.value)}
        formatOptionLabel={(opt) => (
          <span className="subject-option">
            <span className="subject-option-icon">{opt.icon}</span>
            {opt.label}
          </span>
        )}
      />
    </div>
  );
}
