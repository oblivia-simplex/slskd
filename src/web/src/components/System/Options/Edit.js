import React, { useState, useEffect } from 'react';

import { Button, Icon, Message } from 'semantic-ui-react';
import CodeEditor from '@uiw/react-textarea-code-editor';

import { getYaml, validateYaml, updateYaml } from '../../../lib/options';
import PlaceholderSegment from '../../Shared/PlaceholderSegment';

const Edit = ({ options }) => {
  const [{ loading, error }, setLoading] = useState({ loading: true, error: false });
  const [{ yaml, isDirty }, setYaml] = useState({ yaml: undefined, isDirty: false });
  const [yamlError, setYamlError] = useState();

  useEffect(() => {
    get();
  }, [])

  const get = async () => {
    setLoading({ loading: true, error: false });

    try {
      const yaml = await getYaml();
      setYaml({ yaml: yaml, isDirty: false })
      setLoading({ loading: false, error: false })
    } catch (error) {
      setLoading({ loading: false, error: error.message })
    }
  }

  const update = async (yaml) => {
    setYaml({ yaml, isDirty: true });
    validate(yaml);
  }

  const validate = async (yaml) => {
    const response = await validateYaml({ yaml });
    setYamlError(response);
  }

  const save = async (yaml) => {
    await validate(yaml);

    if (!yamlError) {
      await updateYaml({ yaml });
      await get();
    }
  }

  const cancel = () => get();

  if (loading) {
    return <PlaceholderSegment loading={true}/>
  }

  if (error) {
    return <PlaceholderSegment icon='close'/>
  }

  return (
    <>
      <div style={{textAlign: 'right'}}>
        <Button primary disabled={!isDirty} onClick={() => save(yaml)}><Icon name='save'/>Save</Button>
        {isDirty && <Button onClick={cancel}><Icon name='close'/>Cancel</Button>}
      </div>
      {yamlError && <Message icon='x' negative>{yamlError}</Message>}
      <CodeEditor
        value={yaml}
        language='yaml'
        onChange={(e) => update(e.target.value)}
        padding={10}
        style={{
          marginTop: 14,
          border: '1px solid #d4d4d5',
          backgroundColor: '#f5f5f5',
          fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
        }}
      />
    </>
  );
}

export default Edit;