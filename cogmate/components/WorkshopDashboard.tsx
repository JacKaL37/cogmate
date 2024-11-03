'use client';

import React from 'react';
import DynamicAIChat from '@/components/DynamicAIChat';
import PromptTreeEditor from '@/components/PromptTreeEditor';
import PromptManager from '@/components/PromptManager';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import appReducer from '@/store/appSlice';

const store = configureStore({
  reducer: {
    app: appReducer,
  },
});

const components = [
  { name: 'DynamicAIChat', component: <DynamicAIChat /> },
  { name: 'PromptManager', component: <PromptManager /> },
  { name: 'PromptTreeEditor', component: <PromptTreeEditor /> },
  { name: 'Tooltip', component: (
    <Tooltip>
      <TooltipTrigger>Hover me</TooltipTrigger>
      <TooltipContent>Tooltip content with more details</TooltipContent>
    </Tooltip>
  ) },
  { name: 'Select', component: (
    <>
      <Select>
        <SelectTrigger>Select an option</SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>
    </>
  ) },
  { name: 'Button', component: <Button onClick={() => alert('Button clicked!')}>Click me</Button> },
  { name: 'Input', component: <Input placeholder="Type here" defaultValue="Default text" /> },
  { name: 'Textarea', component: <Textarea placeholder="Type here" defaultValue="Default text in textarea" /> },
  { name: 'Card', component: (
    <Card>
      <CardContent>
        <h4>Card Title</h4>
        <p>Card content with more details and information.</p>
      </CardContent>
    </Card>
  ) },
  { name: 'Checkbox', component: <Checkbox defaultChecked>Check me</Checkbox> },
  { name: 'Slider', component: <Slider defaultValue={[50]} min={0} max={100} step={1} /> },
];

const WorkshopDashboard = () => {
  return (
    <Provider store={store}>
      <TooltipProvider>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: "black", color: "white" }}>
          <div style={{ flex: '1 1 auto', overflowY: 'auto', padding: '16px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              {components.map(({ name, component }) => (
                <div key={name} style={{ flex: '1 1 calc(33.333% - 16px)', boxSizing: 'border-box', padding: '16px', border: '1px solid #ccc', borderRadius: '4px', overflowY: 'scroll',  maxHeight: 'calc(80vh - 200px)' }}>
                  <h3>{name}</h3>
                  {component}
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex: '0 0 200px', overflowY: 'auto', padding: '16px', backgroundColor: '#222' }}>
            <h3>Global App State</h3>
            <pre style={{ background: '#010101', padding: '8px', borderRadius: '4px', color: 'white' }}>
              {/* Display global app state here */}
            </pre>
          </div>
        </div>
      </TooltipProvider>
    </Provider>
  );
};

export default WorkshopDashboard;