
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Camera, Image, Info } from 'lucide-react';
import { toast } from 'sonner';
import { cameraService } from '@/services/CameraService';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Home = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleCaptureImage = async () => {
    try {
      const imageData = await cameraService.captureImage();
      if (imageData) {
        setSelectedImage(imageData.webPath);
        toast.success("Image captured successfully!");
      }
    } catch (error) {
      toast.error("Failed to capture image. Please try again.");
      console.error("Camera error:", error);
    }
  };

  const handleSelectImage = async () => {
    try {
      const imageData = await cameraService.selectImage();
      if (imageData) {
        setSelectedImage(imageData.webPath);
        toast.success("Image selected successfully!");
      }
    } catch (error) {
      toast.error("Failed to select image. Please try again.");
      console.error("Gallery error:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md bg-gradient-to-b from-green-50 to-white min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-center text-green-800 mb-2">
          Leaf Area Measurement
        </h1>
        <p className="text-center text-green-600 text-sm">
          Precision Agriculture Made Simple
        </p>
      </header>
      
      {selectedImage && (
        <Card className="mb-6 overflow-hidden border-2 border-green-200 shadow-lg">
          <div className="aspect-w-16 aspect-h-9 relative w-full h-56">
            <img 
              src={selectedImage} 
              alt="Selected Leaf" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <CardFooter className="bg-green-100 p-3 flex justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-green-700 border-green-300"
              onClick={() => setSelectedImage(null)}
            >
              Remove
            </Button>
            <Button 
              className="bg-green-700 hover:bg-green-800" 
              size="sm"
            >
              Analyze Leaf
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <Card className="mb-6 bg-white border-2 border-green-200 shadow-lg">
        <CardHeader className="bg-green-100">
          <CardTitle className="text-green-700 text-xl font-bold">Capture Leaf Image</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-gray-600 mb-5 text-sm">
            Select a method to analyze a leaf. Make sure to include a red calibration object alongside the leaf.
          </p>
          
          <div className="flex flex-col gap-3">
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-lg py-6 rounded-lg shadow-md flex items-center justify-center gap-3"
              onClick={handleCaptureImage}
            >
              <Camera size={24} />
              Capture New Image
            </Button>
            
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-lg py-6 rounded-lg shadow-md flex items-center justify-center gap-3"
              onClick={handleSelectImage}
            >
              <Image size={24} />
              Select from Gallery
            </Button>
            
            <Button 
              className="w-full bg-white text-green-700 border-2 border-green-500 hover:bg-green-50 shadow-sm text-lg py-6 rounded-lg flex items-center justify-center gap-3" 
              variant="outline"
            >
              <Info size={24} />
              View Results
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white border-2 border-green-200 shadow-lg">
        <CardHeader className="bg-green-100">
          <CardTitle className="text-green-700 text-xl font-bold">How it Works</CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <ol className="list-decimal pl-5 space-y-3 text-gray-600">
            <li>Capture or select an image containing a leaf and a red calibration object</li>
            <li>The app will detect green (leaf) and red (calibration) pixels</li>
            <li>Set the known area of your calibration object</li>
            <li>The leaf area will be calculated and saved to your results</li>
          </ol>
        </CardContent>
      </Card>

      <Alert className="mt-8 bg-green-50 border border-green-200">
        <AlertDescription className="text-center text-sm text-green-800">
          Developed by Alok, Shafique, and Arif &copy; 2025
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default Home;
