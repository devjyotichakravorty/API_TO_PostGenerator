import React from 'react';
import { AdvancedQAForm } from './components/AdvancedQAForm';
import './App.css';

function App(): React.ReactElement {
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🚀 Advanced QA Test Generator</h1>
          <p>Execute APIs, inspect responses, and generate Postman test scripts with validation rules</p>
        </div>
      </header>

      <main className="app-main">
        <AdvancedQAForm />
      </main>

      <footer className="app-footer">
        <p>
          Made with ❤️ for QA Engineers | Version 2.0.0 - Advanced QA Workflow |{' '}
          <a href="#features">Features</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
