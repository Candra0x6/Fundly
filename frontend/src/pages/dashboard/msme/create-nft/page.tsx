"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Upload,
  ImageIcon,
  DollarSign,
  Clock,
  Info,
  CheckCircle2,
  AlertTriangle,
  X,
} from "lucide-react";
import NFTPreview from "@/components/msme-dashboard/nft-preview";
import ImageCropper from "@/components/msme-dashboard/image-cropper";
import toast from "react-hot-toast";

export default function CreateNFTPage() {
  // Mock user data
  const user = {
    name: "Sarah Chen",
    role: "msme",
    avatar: "/placeholder.svg?height=40&width=40",
    company: "GreenTech Solutions",
  };

  // State for NFT form
  const [nftData, setNftData] = useState({
    title: "",
    description: "",
    price: "",
    returnRate: [15],
    timeframe: "quarterly",
    duration: "1",
    totalSupply: "",
    minInvestment: "",
    image: "/placeholder.svg?height=300&width=500",
    termsAccepted: false,
  });

  // State for image upload
  const [showCropper, setShowCropper] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNftData({
      ...nftData,
      [name]: value,
    });
  };

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    setNftData({
      ...nftData,
      returnRate: value,
    });
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setNftData({
      ...nftData,
      [name]: value,
    });
  };

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setNftData({
      ...nftData,
      termsAccepted: checked,
    });
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target) {
          setUploadedImage(event.target.result as string);
          setShowCropper(true);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  // Handle cropped image
  const handleCroppedImage = (croppedImage: string) => {
    setNftData({
      ...nftData,
      image: croppedImage,
    });
    setShowCropper(false);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit the NFT data to the backend
    console.log("NFT Data:", nftData);
    // Redirect to success page or show success message
    toast.success("NFT created successfully!");
  };

  return (
    <div className="min-h-screen bg-white">

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => (window.location.href = "/dashboard/msme")}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Create Revenue Share NFT</h1>
          </div>
          <p className="text-zinc-500 max-w-3xl">
            Create a new NFT that represents a share of your future revenue.
            Investors will be able to purchase these NFTs and receive
            distributions based on your reported revenue.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* NFT Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <Card className="mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">NFT Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">NFT Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g., Q3 Revenue Share"
                      value={nftData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe what this NFT represents, including details about the revenue stream"
                      value={nftData.description}
                      onChange={handleInputChange}
                      required
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">NFT Price (FND)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          placeholder="5000"
                          value={nftData.price}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="totalSupply">Total Supply</Label>
                      <Input
                        id="totalSupply"
                        name="totalSupply"
                        type="number"
                        placeholder="100"
                        value={nftData.totalSupply}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="minInvestment">
                        Minimum Investment (FND)
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
                        <Input
                          id="minInvestment"
                          name="minInvestment"
                          type="number"
                          placeholder="1000"
                          value={nftData.minInvestment}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timeframe">Distribution Timeframe</Label>
                      <Select
                        value={nftData.timeframe}
                        onValueChange={(value) =>
                          handleSelectChange("timeframe", value)
                        }
                      >
                        <SelectTrigger id="timeframe">
                          <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="biannual">Bi-annual</SelectItem>
                          <SelectItem value="annual">Annual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Select
                      value={nftData.duration}
                      onValueChange={(value) =>
                        handleSelectChange("duration", value)
                      }
                    >
                      <SelectTrigger id="duration">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Year</SelectItem>
                        <SelectItem value="2">2 Years</SelectItem>
                        <SelectItem value="3">3 Years</SelectItem>
                        <SelectItem value="5">5 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    Revenue Share Percentage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-500">
                        Revenue Share Percentage
                      </span>
                      <span className="font-medium">
                        {nftData.returnRate[0]}%
                      </span>
                    </div>
                    <Slider
                      defaultValue={[15]}
                      max={30}
                      min={5}
                      step={1}
                      value={nftData.returnRate}
                      onValueChange={handleSliderChange}
                    />
                    <div className="flex justify-between text-xs text-zinc-500">
                      <span>5%</span>
                      <span>30%</span>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-700">
                          The revenue share percentage determines how much of
                          your reported revenue will be distributed to NFT
                          holders. For example, if you set 15% and report
                          $10,000 in revenue, $1,500 will be distributed to NFT
                          holders.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">NFT Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!showCropper ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div
                        className="border-2 border-dashed border-zinc-200 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-300 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                        <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                          <Upload className="h-6 w-6 text-emerald-600" />
                        </div>
                        <p className="font-medium text-center">Upload Image</p>
                        <p className="text-xs text-zinc-500 text-center mt-1">
                          Drag and drop or click to upload
                          <br />
                          JPG, PNG or GIF, max 5MB
                        </p>
                      </div>

                      <div className="flex items-center justify-center bg-zinc-50 rounded-lg overflow-hidden">
                        {nftData.image ? (
                          <img
                            src={nftData.image || "/placeholder.svg"}
                            alt="NFT Preview"
                            className="max-w-full max-h-[200px] object-contain"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center p-6">
                            <ImageIcon className="h-12 w-12 text-zinc-300 mb-2" />
                            <p className="text-zinc-400 text-sm">
                              No image uploaded
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Crop Image</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowCropper(false)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <ImageCropper
                        image={uploadedImage || ""}
                        onCropComplete={handleCroppedImage}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Terms & Conditions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="max-h-[200px] overflow-y-auto p-4 bg-zinc-50 rounded-lg text-sm text-zinc-600">
                    <h4 className="font-medium mb-2">
                      NFT Revenue Share Agreement
                    </h4>
                    <p className="mb-2">
                      This NFT Revenue Share Agreement ("Agreement") is entered
                      into between GreenTech Solutions ("Issuer") and the
                      purchaser of the NFT ("Holder").
                    </p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>
                        <strong>Revenue Share:</strong> The Issuer agrees to
                        share a percentage of its revenue with the Holder as
                        specified in the NFT details.
                      </li>
                      <li>
                        <strong>Distribution Schedule:</strong> Revenue
                        distributions will be made according to the schedule
                        specified in the NFT details.
                      </li>
                      <li>
                        <strong>Term:</strong> This Agreement shall remain in
                        effect for the duration specified in the NFT details,
                        starting from the date of purchase.
                      </li>
                      <li>
                        <strong>Reporting:</strong> The Issuer shall provide
                        revenue reports to the Holder prior to each
                        distribution.
                      </li>
                      <li>
                        <strong>Transferability:</strong> The NFT and all rights
                        under this Agreement are transferable by the Holder.
                      </li>
                      <li>
                        <strong>Governing Law:</strong> This Agreement shall be
                        governed by the laws of Singapore.
                      </li>
                    </ol>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={nftData.termsAccepted}
                      onCheckedChange={handleCheckboxChange}
                      required
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the terms and conditions
                    </label>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = "/dashboard/msme")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600"
                  disabled={!nftData.termsAccepted}
                >
                  Create NFT
                </Button>
              </div>
            </form>
          </div>

          {/* NFT Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">NFT Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <NFTPreview nft={nftData} />
                </CardContent>
              </Card>

              <div className="mt-6 space-y-4">
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-emerald-700">
                        Verified Business
                      </p>
                      <p className="text-sm text-emerald-600 mt-1">
                        Your business is verified, which increases investor
                        trust and improves funding success rates.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-700">
                        Important Note
                      </p>
                      <p className="text-sm text-yellow-600 mt-1">
                        Once created, the NFT details cannot be modified. Please
                        review all information carefully before creating.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-700">
                        Funding Timeline
                      </p>
                      <p className="text-sm text-blue-600 mt-1">
                        After creation, your NFT will be listed in the
                        marketplace for 30 days or until fully funded.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
