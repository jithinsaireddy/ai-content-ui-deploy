import React from 'react';

export default function CommunityModel() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Community Model</h1>
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
        <p className="text-muted-foreground mb-4">
          Train your model here to generate content specifically tailored for your community.
        </p>
        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="font-medium mb-2">Example Use Case</h3>
          <p className="text-sm text-muted-foreground">
            A fitness community could train their AI to generate content that matches their niche 
            (e.g., high-intensity workout plans, healthy eating tips), and the AI would become 
            highly specialized for their needs.
          </p>
        </div>
      </div>
    </div>
  );
}
