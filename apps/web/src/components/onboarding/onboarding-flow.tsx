'use client'

import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, Rocket } from 'lucide-react'
import { useState } from 'react'
import { OnboardingStep } from './onboarding-step'

interface OnboardingData {
  firstName: string
  lastName: string
  company: string
  role: string
  bio: string
  goals: string[]
  experience: string
  timezone: string
}

const GOALS = [
  'Build a SaaS product',
  'Learn Next.js',
  'Create a startup',
  'Improve development skills',
  'Build internal tools',
  'Create a marketplace',
  'Build a community platform',
  'Other',
]

const TIMEZONES = [
  'America/New_York',
  'America/Los_Angeles',
  'America/Chicago',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Dubai',
  'Australia/Sydney',
  'UTC',
]

export function OnboardingFlow({
  onComplete,
}: { onComplete: (data: OnboardingData) => Promise<void> }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<OnboardingData>({
    firstName: '',
    lastName: '',
    company: '',
    role: '',
    bio: '',
    goals: [],
    experience: '',
    timezone: 'UTC',
  })

  const totalSteps = 5

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1)
    } else {
      setIsLoading(true)
      try {
        await onComplete(data)
      } catch (error) {
        console.error('Error completing onboarding:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const toggleGoal = (goal: string) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <OnboardingStep
            title="Welcome to SaaS Better! 🎉"
            description="Let's set up your account to get you started quickly"
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNext={handleNext}
            nextLabel="Get Started"
          >
            <div className="space-y-4 text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Rocket className="w-8 h-8 text-primary" />
              </div>
              <p className="text-muted-foreground">
                You&apos;re about to embark on building amazing SaaS applications with our
                comprehensive boilerplate.
              </p>
            </div>
          </OnboardingStep>
        )

      case 2:
        return (
          <OnboardingStep
            title="Tell us about yourself"
            description="Help us personalize your experience"
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNext={handleNext}
            onPrev={handlePrev}
            nextLabel="Continue"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={data.firstName}
                    onChange={(e) => updateData({ firstName: e.target.value })}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={data.lastName}
                    onChange={(e) => updateData({ lastName: e.target.value })}
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company (Optional)</Label>
                <Input
                  id="company"
                  value={data.company}
                  onChange={(e) => updateData({ company: e.target.value })}
                  placeholder="Acme Inc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Your Role</Label>
                <Select value={data.role} onValueChange={(value) => updateData({ role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="founder">Founder/CEO</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="product-manager">Product Manager</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={data.timezone}
                  onValueChange={(value) => updateData({ timezone: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </OnboardingStep>
        )

      case 3:
        return (
          <OnboardingStep
            title="What are your goals?"
            description="Help us understand what you want to achieve"
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNext={handleNext}
            onPrev={handlePrev}
            nextLabel="Continue"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {GOALS.map((goal) => (
                  <div key={goal} className="flex items-center space-x-2">
                    <Checkbox
                      id={goal}
                      checked={data.goals.includes(goal)}
                      onCheckedChange={() => toggleGoal(goal)}
                    />
                    <Label htmlFor={goal} className="text-sm cursor-pointer">
                      {goal}
                    </Label>
                  </div>
                ))}
              </div>
              {data.goals.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {data.goals.map((goal) => (
                    <Badge key={goal} variant="secondary">
                      {goal}
                      <button
                        type="button"
                        onClick={() => toggleGoal(goal)}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </OnboardingStep>
        )

      case 4:
        return (
          <OnboardingStep
            title="Your experience & background"
            description="Tell us more about your experience level"
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNext={handleNext}
            onPrev={handlePrev}
            nextLabel="Continue"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level</Label>
                <Select
                  value={data.experience}
                  onValueChange={(value) => updateData({ experience: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner - New to development</SelectItem>
                    <SelectItem value="intermediate">Intermediate - Some experience</SelectItem>
                    <SelectItem value="advanced">Advanced - Multiple projects</SelectItem>
                    <SelectItem value="expert">Expert - Professional developer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio (Optional)</Label>
                <Textarea
                  id="bio"
                  value={data.bio}
                  onChange={(e) => updateData({ bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>
            </div>
          </OnboardingStep>
        )

      case 5:
        return (
          <OnboardingStep
            title="Almost done! 🎉"
            description="Review your information and complete setup"
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNext={handleNext}
            onPrev={handlePrev}
            nextLabel="Complete Setup"
            isLastStep={true}
            isLoading={isLoading}
          >
            <div className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <h3 className="font-medium">Review your information:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span>
                      {data.firstName} {data.lastName}
                    </span>
                  </div>
                  {data.company && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Company:</span>
                      <span>{data.company}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Role:</span>
                    <span>{data.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Goals:</span>
                    <span>{data.goals.join(', ')}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <h4 className="font-medium text-green-800">Ready to go!</h4>
                    <p className="text-sm text-green-700">
                      Your account will be set up with all the features you need to start building.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </OnboardingStep>
        )

      default:
        return null
    }
  }

  return renderStep()
}
