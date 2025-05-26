import React, { useState } from 'react';

function LibreTranslateTest() {
  const [result, setResult] = useState('');

  const translate = () => {
    fetch('https://translate.argosopentech.com/translate', {
      method: 'POST',
      body: JSON.stringify({
        q: 'Hello world',
        source: 'en',
        target: 'he',
        format: 'text'
      }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => setResult(data.translatedText))
      .catch(err => setResult('Error: ' + err));
  };

  return (
    <div style={{ margin: 24 }}>
      <button onClick={translate} style={{ padding: '8px 16px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: 4 }}>
        Translate "Hello world" to Hebrew
      </button>
      <div style={{ marginTop: 16, fontSize: 18 }}>
        Result: {result}
      </div>
    </div>
  );
}

export default LibreTranslateTest;