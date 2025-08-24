import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

interface WelcomeEmailProps {
  name: string
  loginUrl: string
}

export default function WelcomeEmail({ name, loginUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to SaaS Yacht Club! 🎉</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto max-w-xl bg-white rounded-lg shadow-lg">
            <Section className="px-8 py-12">
              <div className="text-center">
                <Heading className="text-3xl font-bold text-gray-900 mb-4">
                  Welcome aboard! ⚓
                </Heading>
                <Text className="text-lg text-gray-600 mb-6">
                  Hey {name}! Welcome to the SaaS Yacht Club community.
                </Text>
                <Text className="text-gray-600 mb-8">
                  You're now part of an exclusive community of SaaS founders and developers building
                  the next generation of software businesses.
                </Text>

                <div className="bg-blue-50 rounded-lg p-6 mb-8">
                  <Heading className="text-lg font-semibold text-blue-900 mb-2">
                    What's next?
                  </Heading>
                  <ul className="text-left text-blue-800 space-y-1">
                    <li>✅ Complete your profile</li>
                    <li>✅ Explore the dashboard</li>
                    <li>✅ Join our community channels</li>
                    <li>✅ Start building!</li>
                  </ul>
                </div>

                <Button
                  href={loginUrl}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Get Started
                </Button>
              </div>

              <Section className="mt-12 pt-8 border-t border-gray-200">
                <Text className="text-sm text-gray-500 text-center">
                  Need help? Reply to this email or visit our{' '}
                  <a
                    href="https://saasyachtclub.com/help"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    help center
                  </a>
                </Text>
                <Text className="text-xs text-gray-400 text-center mt-4">
                  © 2024 SaaS Yacht Club. All rights reserved.
                </Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
