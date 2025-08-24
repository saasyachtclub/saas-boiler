'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface OnboardingStepProps {
  title: string
  description: string
  children: React.ReactNode
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrev?: () => void
  nextLabel?: string
  isLastStep?: boolean
  isLoading?: boolean
}

export function OnboardingStep({
  title,
  description,
  children,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  nextLabel = 'Next',
  isLastStep = false,
  isLoading = false,
}: OnboardingStepProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mb-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription className="text-lg">{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {children}
          <div className="flex justify-between items-center pt-6">
            {onPrev ? (
              <Button variant="outline" onClick={onPrev}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            ) : (
              <div></div>
            )}
            <Button onClick={onNext} disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                <>
                  {nextLabel}
                  {!isLastStep && <ChevronRight className="ml-2 h-4 w-4" />}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
