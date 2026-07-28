import Select, { type StylesConfig } from "react-select";
import type { SubjectListItem } from "../types";

interface Option {
  value: string;
  label: string;
}

interface Props {
  subjectList: SubjectListItem[];
  selectedSubjectId: string | null;
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

export default function SubjectSwitcher({
  subjectList,
  selectedSubjectId,
  onChange,
}: Props) {
  const options: Option[] = subjectList.map((s) => ({
    value: s._id,
    label: s.name,
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
      />
    </div>
  );
}
