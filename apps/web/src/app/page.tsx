import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">
            <span className="text-blue-600">⚓</span> SaaS Yacht Club
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-600 mb-4">
            The Ultimate <span className="font-semibold text-green-600">FREE</span> & Open Source SaaS Boilerplate
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <Badge variant="secondary" className="bg-black text-white">
              Next.js 15
            </Badge>
            <Badge variant="secondary" className="bg-blue-600 text-white">
              React 19
            </Badge>
            <Badge variant="secondary" className="bg-blue-500 text-white">
              TypeScript 5.7
            </Badge>
            <Badge variant="secondary" className="bg-green-600 text-white">
              Production Ready
            </Badge>
          </div>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Built with cutting-edge technologies: Better Auth, Stripe, Neon PostgreSQL, Drizzle ORM, 
            shadcn/ui, and Tailwind CSS. Everything you need to launch your SaaS in days, not months.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              Star on GitHub
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
