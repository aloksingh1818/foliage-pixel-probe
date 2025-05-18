
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Home = () => {
  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold text-center text-green-800 mb-6">
        Leaf Area Measurement
      </h1>
      
      <Card className="mb-4 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-700">Welcome!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Measure leaf area using image processing. Capture or select a leaf image to get started.
          </p>
          
          <div className="flex flex-col gap-3">
            <Button className="w-full bg-green-600 hover:bg-green-700">
              Capture Image
            </Button>
            
            <Button className="w-full bg-green-600 hover:bg-green-700">
              Select Image
            </Button>
            
            <Button className="w-full" variant="outline">
              View Results
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-700">How it Works</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-5 space-y-2 text-gray-600">
            <li>Capture or select an image containing a leaf and a red calibration object</li>
            <li>The app will detect green (leaf) and red (calibration) pixels</li>
            <li>Set the known area of your calibration object</li>
            <li>The leaf area will be calculated and saved to your results</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
