import React from 'react';

import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage, syntaxHighlighting, defaultHighlightStyle  } from '@codemirror/language';
import { yaml } from '@codemirror/legacy-modes/mode/yaml';

const CodeEditor = ({ value, onChange = () => {}, ...rest}) => {
  console.log(defaultHighlightStyle);
  return (
    <CodeMirror
      value={value}
      extensions={[
        StreamLanguage.define(yaml),  
        syntaxHighlighting(defaultHighlightStyle, {fallback: true})]}
      onChange={(value, _) => onChange(value)}
      { ...rest}
    />
  );
};

export default CodeEditor;