
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Camera, Image, Info } from 'lucide-react';
import { toast } from 'sonner';
import { cameraService } from '@/services/CameraService';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const Home = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<{leafArea: number} | null>(null);

  const handleCaptureImage = async () => {
    try {
      const imageData = await cameraService.captureImage();
      if (imageData) {
        setSelectedImage(imageData.webPath);
        toast.success("Image captured successfully!");
        setIsImageDialogOpen(true);
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
        setIsImageDialogOpen(true);
      }
    } catch (error) {
      toast.error("Failed to select image. Please try again.");
      console.error("Gallery error:", error);
    }
  };

  const handleAnalyzeLeaf = () => {
    setIsAnalyzing(true);
    
    // Simulate analysis process
    setTimeout(() => {
      setIsAnalyzing(false);
      
      // Mock analysis result
      const mockLeafArea = Math.floor(Math.random() * 500) + 100;
      setAnalysisResult({
        leafArea: mockLeafArea
      });
      
      toast.success("Leaf analysis completed!");
    }, 2000);
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
              onClick={handleAnalyzeLeaf}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Leaf"}
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
              disabled={!analysisResult}
              onClick={() => setAnalysisResult && setIsImageDialogOpen(true)}
            >
              <Info size={24} />
              {analysisResult ? "View Results" : "No Results Yet"}
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
          Developed by Alok, Sharique, and Arif &copy; 2025
        </AlertDescription>
      </Alert>

      {/* Image Analysis Results Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{analysisResult ? "Leaf Analysis Results" : "Image Confirmation"}</DialogTitle>
          </DialogHeader>
          
          {selectedImage && (
            <div className="aspect-w-16 aspect-h-9 relative w-full h-48 mb-4">
              <img 
                src={selectedImage} 
                alt="Selected Leaf" 
                className="rounded-md object-cover w-full h-full"
              />
            </div>
          )}
          
          {analysisResult ? (
            <div className="p-4 bg-green-50 rounded-md mb-4">
              <h3 className="font-bold text-green-800 mb-2">Analysis Results:</h3>
              <p className="mb-2"><span className="font-semibold">Leaf Area:</span> {analysisResult.leafArea} cm²</p>
              <p className="text-sm text-gray-600">Analysis completed successfully.</p>
            </div>
          ) : (
            <p className="text-gray-700 mb-4">
              Is this image suitable for leaf analysis? The image should clearly show the entire leaf and calibration object.
            </p>
          )}
          
          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsImageDialogOpen(false)}
            >
              {analysisResult ? "Close" : "Cancel"}
            </Button>
            
            {!analysisResult && (
              <Button
                type="button"
                className="bg-green-700 hover:bg-green-800"
                onClick={handleAnalyzeLeaf}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? "Analyzing..." : "Proceed with Analysis"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
