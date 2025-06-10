import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FiLink, FiMessageSquare, FiTarget, FiArrowRight, FiArrowLeft, FiCheck } from "react-icons/fi";
import DashboardLayout from "@/components/layout/DashboardLayout";
import withAuth from "@/components/withAuth";
import Image from "next/image";

function Setup() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form data
  const [formData, setFormData] = useState({
    productLink: "",
    needs: "",
    goals: []
  });
  
  // Subreddit recommendations
  const [recommendedSubreddits, setRecommendedSubreddits] = useState([]);
  const [generatingRecommendations, setGeneratingRecommendations] = useState(false);

  const steps = [
    {
      number: 1,
      title: "Product Link",
      description: "Share your product or service link",
      icon: FiLink
    },
    {
      number: 2,
      title: "Your Needs",
      description: "Tell us what you're looking to achieve",
      icon: FiMessageSquare
    },
    {
      number: 3,
      title: "Subreddit Recommendations",
      description: "Get personalized subreddit suggestions",
      icon: FiTarget
    }
  ];

  const goalOptions = [
    "Increase brand awareness",
    "Drive website traffic",
    "Generate leads",
    "Get feedback on product",
    "Build community",
    "Increase sales",
    "Share knowledge/expertise",
    "Network with others"
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGoalToggle = (goal) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal) 
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const generateRecommendations = async () => {
    setGeneratingRecommendations(true);
    setError("");
    
    try {
      // Mock recommendations for now - in real implementation, this would call an AI service
      const mockRecommendations = [
        {
          name: "r/entrepreneur",
          members: "1.2M",
          description: "A community for entrepreneurs to share ideas and get feedback",
          relevanceScore: 95
        },
        {
          name: "r/startups",
          members: "800K",
          description: "Discussion about startup companies and entrepreneurship",
          relevanceScore: 90
        },
        {
          name: "r/SaaS",
          members: "150K",
          description: "Software as a Service discussion and feedback",
          relevanceScore: 85
        },
        {
          name: "r/marketing",
          members: "500K",
          description: "Marketing strategies and discussions",
          relevanceScore: 80
        },
        {
          name: "r/smallbusiness",
          members: "300K",
          description: "Small business owners sharing experiences",
          relevanceScore: 75
        }
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setRecommendedSubreddits(mockRecommendations);
    } catch (err) {
      setError("Failed to generate recommendations. Please try again.");
    } finally {
      setGeneratingRecommendations(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 1 && !formData.productLink.trim()) {
      setError("Please enter your product link");
      return;
    }
    
    if (currentStep === 2 && (!formData.needs.trim() || formData.goals.length === 0)) {
      setError("Please describe your needs and select at least one goal");
      return;
    }
    
    setError("");
    
    if (currentStep === 2) {
      await generateRecommendations();
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Save setup completion to user profile
      const response = await fetch('/api/user/complete-setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          setupData: formData,
          recommendedSubreddits
        }),
      });

      if (response.ok) {
        router.push('/dashboard/onboarding');
      } else {
        setError("Failed to save setup. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto min-h-screen pb-20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="rounded-lg flex items-center justify-center">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={40}
                height={40}
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Let's Get You Started</h1>
          <p className="text-gray-600">Help us understand your needs so we can provide the best recommendations</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.number 
                  ? 'bg-orange-500 border-orange-500 text-white' 
                  : 'border-gray-300 text-gray-400'
              }`}>
                {currentStep > step.number ? (
                  <FiCheck className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{step.number}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-2 ${
                  currentStep > step.number ? 'bg-orange-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          {/* Step 1: Product Link */}
          {currentStep === 1 && (
            <div>
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mr-4">
                  <FiLink className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Share Your Product Link</h2>
                  <p className="text-gray-600">Help us understand what you're promoting</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product/Service URL
                  </label>
                  <input
                    type="url"
                    value={formData.productLink}
                    onChange={(e) => handleInputChange('productLink', e.target.value)}
                    placeholder="https://your-product.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  This helps us understand your product category and target audience
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Needs and Goals */}
          {currentStep === 2 && (
            <div>
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mr-4">
                  <FiMessageSquare className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Tell Us Your Needs</h2>
                  <p className="text-gray-600">What are you looking to achieve on Reddit?</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe what you need help with
                  </label>
                  <textarea
                    value={formData.needs}
                    onChange={(e) => handleInputChange('needs', e.target.value)}
                    placeholder="e.g., I want to promote my SaaS product to developers and get feedback from potential users..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select your goals (choose all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {goalOptions.map((goal) => (
                      <label key={goal} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.goals.includes(goal)}
                          onChange={() => handleGoalToggle(goal)}
                          className="sr-only"
                        />
                        <div className={`flex items-center justify-center w-5 h-5 border-2 rounded mr-3 ${
                          formData.goals.includes(goal)
                            ? 'bg-orange-500 border-orange-500'
                            : 'border-gray-300'
                        }`}>
                          {formData.goals.includes(goal) && (
                            <FiCheck className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className="text-sm">{goal}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Subreddit Recommendations */}
          {currentStep === 3 && (
            <div>
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mr-4">
                  <FiTarget className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Recommended Subreddits</h2>
                  <p className="text-gray-600">Based on your product and goals</p>
                </div>
              </div>
              
              {generatingRecommendations ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Analyzing your needs and generating recommendations...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendedSubreddits.map((subreddit, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="font-semibold text-lg">{subreddit.name}</h3>
                            <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              {subreddit.members} members
                            </span>
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              {subreddit.relevanceScore}% match
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">{subreddit.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                    <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tips:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Read each subreddit's rules before posting</li>
                      <li>• Engage with the community before promoting</li>
                      <li>• Provide value in your posts, not just promotion</li>
                      <li>• Use our scheduling feature to post at optimal times</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center px-6 py-3 rounded-lg font-medium ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </button>

            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                disabled={generatingRecommendations}
                className="flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <FiArrowRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={loading || generatingRecommendations}
                className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Completing...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <FiCheck className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default withAuth(Setup);