import React from 'react';
import { Wizard } from './components/wizard';
import { Button } from './components/button';

export default function App() {
  const steps = [
    { id: '1', title: 'Start', content: <div>This is step 1</div> },
    { id: '2', title: 'Middle', content: <div>This is step 2</div> },
    { id: '3', title: 'End', content: <div>This is step 3</div> }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <h1>UI Showcase</h1>
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Button</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
          
          <div style={{ width: '100%', height: '1px', background: '#eee', margin: '1rem 0' }} />
          
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon"><span role="img" aria-label="star">⭐</span></Button>
          
          <div style={{ width: '100%', height: '1px', background: '#eee', margin: '1rem 0' }} />
          
          <Button disabled>Disabled</Button>
          <Button variant="outline" disabled>Disabled Outline</Button>
        </div>
      </section>

      <section>
        <h2 style={{ marginBottom: '1rem' }}>Wizard</h2>
        <div style={{ maxWidth: '600px', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <Wizard 
            steps={steps} 
            onComplete={() => alert('Wizard completed!')}
            submitLabel="Complete Showcase"
          />
        </div>
      </section>
    </div>
  );
}
