import dynamic from 'next/dynamic';

const DynamicReactQuill = dynamic(() => import('react-quill'), { ssr: false });




const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
  
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['clean'],
 
    ['link', 'image', 'video'],
    ['clean'],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const formats = [
  'header',
  'font',
  'size',
  'bold',
  'color',
    'italic',
    'image',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
  'font-size',
  'font-family',
];


const RichTextEditor = ({ value, onChange,iframeSrc }) => {
  return (
    <DynamicReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules} 
      formats={formats}
      iframeSrc={iframeSrc}
    />
  );
};

export default RichTextEditor;
