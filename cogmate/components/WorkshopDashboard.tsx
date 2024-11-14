'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import DynamicAIChat from '@/components/DynamicAIChat';
import PromptTreeEditor from '@/components/PromptTreeEditor';
// import PromptManager from '@/components/PromptManager';
// import PromptBrowser from '@/components/PromptBrowser';
import TextBlobGraph from '@/components/TextBlobGraph';
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
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

const store = configureStore({
  reducer: {
    app: appReducer,
  },
});

const components = [
  { name: 'PromptTreeEditor', component: <PromptTreeEditor /> },
  { name: 'DynamicAIChat', component: <DynamicAIChat /> },
  // { name: 'PromptBrowser', component: <PromptBrowser /> },
  // { name: 'PromptManager', component: <PromptManager /> },
  //{ name: 'TextBlobGraph', component: <TextBlobGraph /> },
  // { name: 'Tooltip', component: (
  //   <Tooltip>
  //     <TooltipTrigger>Hover me</TooltipTrigger>
  //     <TooltipContent>Tooltip content with more details</TooltipContent>
  //   </Tooltip>
  // ) },
  // { name: 'Select', component: (
  //   <>
  //     <Select>
  //       <SelectTrigger>Select an option</SelectTrigger>
  //       <SelectContent>
  //         <SelectItem value="option1">Option 1</SelectItem>
  //         <SelectItem value="option2">Option 2</SelectItem>
  //         <SelectItem value="option3">Option 3</SelectItem>
  //       </SelectContent>
  //     </Select>
  //   </>
  // ) },
  // { name: 'Button', component: <Button onClick={() => alert('Button clicked!')}>Click me</Button> },
  // { name: 'Input', component: <Input placeholder="Type here" defaultValue="Default text" /> },
  // { name: 'Textarea', component: <Textarea placeholder="Type here" defaultValue="Default text in textarea" /> },
  // { name: 'Card', component: (
  //   <Card>
  //     <CardContent>
  //       <h4>Card Title</h4>
  //       <p>Card content with more details and information.</p>
  //     </CardContent>
  //   </Card>
  // ) },
  // { name: 'Checkbox', component: <Checkbox defaultChecked>Check me</Checkbox> },
  // { name: 'Slider', component: <Slider defaultValue={[50]} min={0} max={100} step={1} /> },
];

const WorkshopDashboard = () => {
  const appState = useSelector((state: { app: ReturnType<typeof appReducer> }) => state.app);

  return (
    <TooltipProvider>
      <div style={{ display: 'flex', flexDirection: 'column',  backgroundColor: "black", color: "white" }}>
        <ResizablePanelGroup direction="horizontal" style={{ overflowY: 'scroll'}}>
          <ResizablePanel>
            <div style={{ flex: '1 1 auto', overflowY: 'auto', padding: '16px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {components.map(({ name, component }) => (
                  <div key={name} style={{ flex: '1 1 calc(50% - 16px)', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px', overflowY: 'auto', maxHeight: '700px' }}>
                    {component}
                  </div>
                ))}
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={25}>
            <div style={{ flex: '0 0 200px', overflowY: 'auto', padding: '16px', backgroundColor: '#222' }}>
              <h3>App State</h3>
              <pre style={{ background: '#010101', padding: '8px', borderRadius: '4px', color: 'white', overflow: 'scroll'}}>
                {JSON.stringify(appState, null, 2)}
              </pre>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </TooltipProvider>
  );
};

const App = () => (
  <Provider store={store}>
    <WorkshopDashboard />
  </Provider>
);

export default App;