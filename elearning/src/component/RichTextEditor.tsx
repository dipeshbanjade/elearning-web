import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import katex from "katex";
import "katex/dist/katex.min.css";

// Quill's formula (ƒ) toolbar button renders with KaTeX, but only looks
// for it on window — it doesn't accept it as an import/module option.
(window as any).katex = katex;

const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ align: [] }],
  ["blockquote", "code-block"],
  ["link", "image", "video", "formula"],
  ["clean"],
];

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      modules={{ toolbar: toolbarOptions }}
    />
  );
}
