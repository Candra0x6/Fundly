import React, { useState, useEffect, useRef } from 'react';
import { useVerificationWorkflow } from '../hooks/useVerificationWorkflow';
import { Principal } from '@dfinity/principal';

// Example component for creating a new verification request
export const CreateVerificationRequestExample: React.FC = () => {
  const { createVerificationRequest, loading, error } = useVerificationWorkflow();
  const [msmeId, setMsmeId] = useState('');
  const [requiredDocuments, setRequiredDocuments] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Convert comma-separated string to array
      const documentsArray = requiredDocuments.split(',').map(doc => doc.trim());
      const response = await createVerificationRequest(msmeId, documentsArray);

      if ('ok' in response) {
        setResult(`Successfully created verification request with ID: ${response.ok}`);
      } else {
        setResult(`Error: ${JSON.stringify(response.err)}`);
      }
    } catch (error) {
      setResult(`Error: ${error}`);
    }
  };

  return (
    <div>
      <h2>Create Verification Request</h2>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            MSME ID:
            <input
              type="text"
              value={msmeId}
              onChange={(e) => setMsmeId(e.target.value)}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Required Documents (comma-separated):
            <input
              type="text"
              value={requiredDocuments}
              onChange={(e) => setRequiredDocuments(e.target.value)}
              placeholder="Business License, Tax Certificate, ID Card"
              required
            />
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Create Request'}
        </button>
      </form>

      {result && <div className="result">{result}</div>}
    </div>
  );
};

// Example component for retrieving verification request details
export const GetVerificationRequestExample: React.FC = () => {
  const { getVerificationRequest, loading, error } = useVerificationWorkflow();
  const [requestId, setRequestId] = useState('');
  const [request, setRequest] = useState<any>(null);

  const handleFetch = async () => {
    try {
      const result = await getVerificationRequest(requestId);
      if ('ok' in result) {
        setRequest(result.ok);
      } else {
        console.error('Error fetching request:', result.err);
        setRequest(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Get Verification Request</h2>
      {error && <div className="error">{error}</div>}

      <div>
        <label>
          Request ID:
          <input
            type="text"
            value={requestId}
            onChange={(e) => setRequestId(e.target.value)}
          />
        </label>
        <button onClick={handleFetch} disabled={loading || !requestId}>
          {loading ? 'Loading...' : 'Get Details'}
        </button>
      </div>

      {request && (
        <div className="result">
          <h3>Request Details</h3>
          <pre>{JSON.stringify(request, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

// Example component for uploading documents with file support
export const UploadDocumentExample: React.FC = () => {
  const { uploadDocument, loading, error } = useVerificationWorkflow();
  const [requestId, setRequestId] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [result, setResult] = useState<string | null>(null);

  // New state variables for file upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handler for file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      // Auto-fill document name based on file name if empty
      if (!documentName) {
        const fileName = files[0].name;
        const nameWithoutExtension = fileName.split('.').slice(0, -1).join('.');
        setDocumentName(nameWithoutExtension || fileName);
      }
    }
  };

  // Function to upload file to asset canister or storage
  const uploadFile = async (): Promise<string> => {
    if (!selectedFile) {
      throw new Error("No file selected");
    }

    // In a real application, you would integrate with your asset canister or storage service
    // This is a placeholder implementation to simulate file upload
    setIsUploading(true);
    setUploadProgress(0);

    return new Promise((resolve, reject) => {
      // Simulate upload progress
      const totalTime = 2000; // 2 seconds for demo
      const interval = 100; // Update every 100ms
      const steps = totalTime / interval;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        const progress = Math.min(Math.round((currentStep / steps) * 100), 100);
        setUploadProgress(progress);

        if (progress >= 100) {
          clearInterval(timer);
          setIsUploading(false);

          // In a real application, the asset canister would return a URL
          // For demo purposes, we're creating a placeholder URL
          const assetCanisterId = "aaaaa-bbbbb";
          const fileName = encodeURIComponent(selectedFile.name.replace(/\s+/g, '_'));
          const url = `https://${assetCanisterId}.raw.ic0.app/assets/${fileName}`;
          resolve(url);
        }
      }, interval);
    });
  };

  const handleUploadAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let documentUrl = fileUrl;

      // If a file is selected, upload it first
      if (selectedFile) {
        setResult("Uploading file...");
        documentUrl = await uploadFile();
        setFileUrl(documentUrl);
        setResult(`File uploaded to: ${documentUrl}`);
      }

      // Now upload the document metadata using the obtained URL
      if (documentUrl) {
        setResult("Submitting document information...");
        const response = await uploadDocument(requestId, documentName, documentType, documentUrl);

        if ('ok' in response) {
          setResult('Document successfully uploaded and registered in the verification workflow');
          // Clear form
          setDocumentName('');
          setDocumentType('');
          setFileUrl('');
          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } else {
          setResult(`Error registering document: ${JSON.stringify(response.err)}`);
        }
      } else {
        setResult("Error: No file URL available. Please select a file or enter a URL.");
      }
    } catch (error) {
      setResult(`Error: ${error}`);
    }
  };

  // Allow either direct URL entry or file upload
  const handleManualUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileUrl(e.target.value);
    // If entering URL manually, clear selected file
    if (e.target.value && selectedFile) {
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div>
      <h2>Upload Document</h2>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleUploadAndSubmit}>
        <div>
          <label>
            Request ID:
            <input
              type="text"
              value={requestId}
              onChange={(e) => setRequestId(e.target.value)}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Document Name:
            <input
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Document Type:
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              required
            >
              <option value="">Select document type</option>
              <option value="Business License">Business License</option>
              <option value="Tax Certificate">Tax Certificate</option>
              <option value="ID Card">ID Card</option>
              <option value="Business Registration">Business Registration</option>
              <option value="Other">Other</option>
            </select>
          </label>
        </div>

        <div>
          <label>
            Select File:
            <input
              type="file"
              onChange={handleFileSelect}
              ref={fileInputRef}
              style={{ marginBottom: '10px' }}
            />
          </label>
        </div>

        {isUploading && (
          <div className="upload-progress">
            <div>Uploading: {uploadProgress}%</div>
            <div style={{
              height: '10px',
              width: '100%',
              backgroundColor: '#eee',
              borderRadius: '5px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${uploadProgress}%`,
                backgroundColor: '#4CAF50',
                transition: 'width 0.3s'
              }}></div>
            </div>
          </div>
        )}

        <div>
          <label>
            Or Enter File URL directly:
            <input
              type="text"
              value={fileUrl}
              onChange={handleManualUrlChange}
              placeholder="asset canister reference or URL"
              disabled={!!selectedFile}
            />
          </label>
          <small style={{ display: 'block', marginTop: '5px' }}>
            {selectedFile
              ? `Selected file: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(2)} KB)`
              : "No file selected"}
          </small>
        </div>

        <button
          type="submit"
          disabled={loading || isUploading || (!fileUrl && !selectedFile) || !requestId || !documentName || !documentType}
        >
          {loading || isUploading ? 'Uploading...' : 'Upload Document'}
        </button>
      </form>

      {result && <div className="result">{result}</div>}
    </div>
  );
};

// Full dashboard example with fewer tabs
export const VerificationWorkflowDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('createRequest');

  return (
    <div className="dashboard">
      <h1>Verification Workflow Dashboard</h1>

      <div className="tabs">
        <button
          className={activeTab === 'createRequest' ? 'active' : ''}
          onClick={() => setActiveTab('createRequest')}
        >
          Create Request
        </button>
        <button
          className={activeTab === 'viewRequest' ? 'active' : ''}
          onClick={() => setActiveTab('viewRequest')}
        >
          View Request
        </button>
        <button
          className={activeTab === 'uploadDocument' ? 'active' : ''}
          onClick={() => setActiveTab('uploadDocument')}
        >
          Upload Document
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'createRequest' && <CreateVerificationRequestExample />}
        {activeTab === 'viewRequest' && <GetVerificationRequestExample />}
        {activeTab === 'uploadDocument' && <UploadDocumentExample />}
      </div>
    </div>
  );
};